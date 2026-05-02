document.addEventListener('DOMContentLoaded', function () {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
  }

  var METRICS_URL = 'https://metrics-proxy.joluc.de/metrics.json';
  var CHART_COUNT = 3;
  var chartInstances = {};
  var cachedMetrics = null;

  var COLORS = [
    'hsl(200, 70%, 50%)',
    'hsl(340, 70%, 50%)',
    'hsl(80, 70%, 50%)',
    'hsl(30, 70%, 50%)',
    'hsl(270, 70%, 50%)',
    'hsl(160, 70%, 50%)',
    'hsl(0, 70%, 50%)',
    'hsl(50, 70%, 50%)'
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function pickMetrics(metrics) {
    var shuffled = shuffle(metrics);
    return shuffled.slice(0, CHART_COUNT);
  }

  function renderChart(index, metric, color) {
    var canvas = document.getElementById('chart-' + index);
    var label = document.getElementById('label-' + index);
    var status = document.getElementById('status-' + index);
    if (!canvas || !label || !status) return;

    label.innerText = metric.label;
    status.style.display = 'none';

    if (!metric.series || metric.series.length === 0) {
      status.innerText = 'No data';
      status.style.display = 'block';
      return;
    }

    if (chartInstances[index]) {
      chartInstances[index].destroy();
    }

    var labels = metric.series.map(function (p) {
      var d = new Date(p.t * 1000);
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    });
    var data = metric.series.map(function (p) { return p.v; });

    chartInstances[index] = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: metric.label,
          data: data,
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ctx.parsed.y.toFixed(2) + ' ' + metric.unit;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#aaa', maxTicksLimit: 6, maxRotation: 0 }
          },
          y: {
            display: false,
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    });
  }

  function displayCharts(metrics) {
    var selected = pickMetrics(metrics);
    for (var i = 0; i < CHART_COUNT; i++) {
      renderChart(i, selected[i], COLORS[i % COLORS.length]);
    }
  }

  function fetchAndDisplay() {
    for (var i = 0; i < CHART_COUNT; i++) {
      var s = document.getElementById('status-' + i);
      if (s) { s.innerText = 'Loading...'; s.style.display = 'block'; s.style.color = '#888'; }
    }

    fetch(METRICS_URL)
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(function (payload) {
        cachedMetrics = payload.metrics;
        displayCharts(cachedMetrics);
      })
      .catch(function (err) {
        console.error('metrics-proxy fetch failed:', err);
        for (var i = 0; i < CHART_COUNT; i++) {
          var s = document.getElementById('status-' + i);
          if (s) { s.innerText = 'Error'; s.style.color = 'red'; s.style.display = 'block'; }
        }
      });
  }

  // Initial load
  fetchAndDisplay();

  // Refresh button: re-rolls which charts are shown (re-fetches if data is stale)
  var refreshBtn = document.querySelector('.portfolio__refresh');
  var refreshIcon = refreshBtn ? refreshBtn.querySelector('.refresh-icon') : null;

  if (refreshBtn && refreshIcon) {
    refreshBtn.addEventListener('click', function () {
      if (refreshBtn.classList.contains('is-spinning')) return;

      refreshBtn.classList.add('is-spinning');
      var onAnimationEnd = function () {
        refreshBtn.classList.remove('is-spinning');
        refreshIcon.removeEventListener('animationend', onAnimationEnd);
      };
      refreshIcon.addEventListener('animationend', onAnimationEnd);

      if (cachedMetrics) {
        displayCharts(cachedMetrics);
      } else {
        fetchAndDisplay();
      }
    });
  }
});
