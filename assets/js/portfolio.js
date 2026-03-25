document.addEventListener('DOMContentLoaded', function () {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
  }

  const chartInstances = {};
  let isExpanded = false;

  function fetchAllCharts(hours) {
    const now = Math.floor(Date.now() / 1000);
    const start = now - (hours * 3600);
    const step = 3600;

    return Promise.all([
      loadChart('chartCPU', 'status-cpu', 'rate(process_cpu_seconds_total[1m])', 'CPU', 0, start, now, step),
      loadChart('chartMem', 'status-mem', 'process_resident_memory_bytes', 'Bytes', 120, start, now, step),
      loadChart('chartGo', 'status-go', 'go_goroutines', 'Routines', 240, start, now, step)
    ]);
  }

  function loadChart(canvasId, statusId, query, label, colorHue, start, now, step) {
    const statusDiv = document.getElementById(statusId);
    const canvas = document.getElementById(canvasId);
    if (!canvas || !statusDiv) return Promise.resolve();

    const ctx = canvas.getContext('2d');

    if (chartInstances[canvasId]) {
      statusDiv.style.display = 'block';
      statusDiv.innerText = 'Loading...';
    }

    return fetch('https://prometheus.demo.prometheus.io/api/v1/query_range?query=' + encodeURIComponent(query) + '&start=' + start + '&end=' + now + '&step=' + step)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        statusDiv.style.display = 'none';

        if (data.status === 'success' && data.data.result.length > 0) {
          if (chartInstances[canvasId]) {
            chartInstances[canvasId].destroy();
          }

          const result = data.data.result[0];
          const labels = result.values.map(v => {
            const date = new Date(v[0] * 1000);
            return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
          });
          const points = result.values.map(v => parseFloat(v[1]));
          const color = 'hsl(' + colorHue + ', 70%, 50%)';

          chartInstances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: label,
                data: points,
                borderColor: color,
                backgroundColor: color,
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                tension: 0.2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                legend: { display: false }
              },
              scales: {
                x: {
                  display: true,
                  grid: { color: 'rgba(255,255,255,0.1)' },
                  ticks: {
                    color: '#aaa',
                    maxTicksLimit: 6,
                    maxRotation: 0
                  }
                },
                y: {
                  display: false,
                  grid: { color: 'rgba(255,255,255,0.1)' },
                  ticks: { color: '#aaa', maxTicksLimit: 5 }
                }
              }
            }
          });
        } else {
          statusDiv.innerText = 'No data';
          statusDiv.style.display = 'block';
          if (chartInstances[canvasId]) {
            chartInstances[canvasId].destroy();
            delete chartInstances[canvasId];
          }
        }
      })
      .catch(err => {
        console.error(err);
        statusDiv.innerText = 'Error';
        statusDiv.style.color = 'red';
        statusDiv.style.display = 'block';
      });
  }

  fetchAllCharts(3);

  const toggleBtn = document.querySelector('.portfolio__toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      isExpanded = !isExpanded;
      this.classList.toggle('active');
      fetchAllCharts(isExpanded ? 24 : 3);
    });
  }

  const refreshBtn = document.querySelector('.portfolio__refresh');
  const refreshIcon = refreshBtn ? refreshBtn.querySelector('.refresh-icon') : null;

  if (refreshBtn && refreshIcon) {
    refreshBtn.addEventListener('click', function () {
      if (refreshBtn.classList.contains('is-spinning')) return;

      refreshBtn.classList.add('is-spinning');

      const onAnimationEnd = () => {
        refreshBtn.classList.remove('is-spinning');
        refreshIcon.removeEventListener('animationend', onAnimationEnd);
      };

      refreshIcon.addEventListener('animationend', onAnimationEnd);
      fetchAllCharts(isExpanded ? 24 : 3);
    });
  }
});
