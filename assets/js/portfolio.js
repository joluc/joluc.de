document.addEventListener('DOMContentLoaded', function () {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
  }

  var METRICS_URL = 'https://metrics-proxy.joluc.de/metrics.json';
  var COMPACT_COUNT = 3;
  var COMPACT_POINTS = 12;
  var chartInstances = {};
  var cachedMetrics = null;
  var isExpanded = false;

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

  function destroyAllCharts() {
    Object.keys(chartInstances).forEach(function (key) {
      chartInstances[key].destroy();
      delete chartInstances[key];
    });
  }

  function buildChartSlots(count) {
    var row = document.getElementById('charts-row');
    row.innerHTML = '';
    var colClass = isExpanded ? 'col col-12' : 'col col-4 col-d-6 col-t-12';
    for (var i = 0; i < count; i++) {
      var col = document.createElement('div');
      col.className = colClass;
      col.innerHTML =
        '<div class="chart-label" id="label-' + i + '"></div>' +
        '<div class="chart-status" id="status-' + i + '">Loading...</div>' +
        '<div class="chart-container"><canvas id="chart-' + i + '"></canvas></div>';
      row.appendChild(col);
    }
  }

  function renderChart(index, metric, color, limitPoints) {
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

    var series = metric.series;
    if (limitPoints && series.length > limitPoints) {
      series = series.slice(series.length - limitPoints);
    }

    var labels = series.map(function (p) {
      var d = new Date(p.t * 1000);
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    });
    var data = series.map(function (p) { return p.v; });

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
        layout: {
          padding: { top: 10 }
        },
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
            ticks: { color: '#aaa', maxTicksLimit: isExpanded ? 12 : 6, maxRotation: 0 }
          },
          y: {
            display: isExpanded,
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#aaa', maxTicksLimit: 5 }
          }
        }
      }
    });
  }

  function displayCharts(metrics) {
    destroyAllCharts();

    if (isExpanded) {
      buildChartSlots(metrics.length);
      for (var i = 0; i < metrics.length; i++) {
        renderChart(i, metrics[i], COLORS[i % COLORS.length], null);
      }
    } else {
      var selected = shuffle(metrics).slice(0, COMPACT_COUNT);
      buildChartSlots(COMPACT_COUNT);
      for (var i = 0; i < COMPACT_COUNT; i++) {
        renderChart(i, selected[i], COLORS[i % COLORS.length], COMPACT_POINTS);
      }
    }
  }

  function fetchAndDisplay() {
    var count = isExpanded ? 8 : COMPACT_COUNT;
    buildChartSlots(count);

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
        for (var i = 0; i < count; i++) {
          var s = document.getElementById('status-' + i);
          if (s) { s.innerText = 'Error'; s.style.color = 'red'; s.style.display = 'block'; }
        }
      });
  }

  // Initial load
  fetchAndDisplay();

  // Toggle: compact (3 random, sparkline) ↔ expanded (all, full width)
  var toggleBtn = document.querySelector('.portfolio__toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      isExpanded = !isExpanded;
      document.documentElement.classList.toggle('view-list', isExpanded);
      if (cachedMetrics) {
        displayCharts(cachedMetrics);
      } else {
        fetchAndDisplay();
      }
    });
  }

  // Refresh: re-rolls which charts are shown in compact mode
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
