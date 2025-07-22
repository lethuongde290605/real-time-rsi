const activeCharts = {};  // token_interval -> {chart, timerId}

// Lưu danh sách chart đang mở vào localStorage
function saveChartsToStorage() {
  localStorage.setItem("activeCharts", JSON.stringify(Object.keys(activeCharts)));
}

// Tải lại chart từ localStorage (khi load trang)
function restoreChartsFromStorage() {
  const saved = localStorage.getItem("activeCharts");
  if (!saved) return;

  const keys = JSON.parse(saved); // ['BTC/USDC_60', 'ETH/USDC_5', ...]
  keys.forEach(key => {
    const [token, interval] = key.split("_");
    addRSIChart(token, parseInt(interval));
  });
}

function addRSIChart(token, interval = 60) {
  const key = `${token}_${interval}`;

  if (activeCharts[key]) {
    alert("Chart đã tồn tại!");
    return;
  }

  const container = document.getElementById("rsiCharts");
  const chartDiv = document.createElement("div");
  chartDiv.className = "rsi-card";
  chartDiv.id = `chart-${key}`;

  chartDiv.innerHTML = `
    <h4>${token} - RSI ${interval}s 
      <button onclick="removeChart('${key}')">X</button>
    </h4>
    <canvas id="canvas-${key}" height="100"></canvas>
  `;
  container.appendChild(chartDiv);

  const ctx = document.getElementById(`canvas-${key}`).getContext("2d");
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'RSI14',
        data: [],
        borderColor: 'blue',
        tension: 0.2
      }]
    },
    options: {
      animation: false,
      scales: {
        y: {
          min: 0,
          max: 100
        }
      }
    }
  });

  // Hàm update RSI liên tục
  async function updateRSI() {
    try {
      const res = await fetch(`/rsi?tokens=${token}&interval=${interval}`);
      const data = await res.json();
      const rsiList = data[token][`rsi_${interval}s`];

      if (!Array.isArray(rsiList)) {
        console.warn("⚠️ Không có dữ liệu RSI:", token);
        return;
      }

      chart.data.labels = rsiList.map((_, i) => i);
      chart.data.datasets[0].data = rsiList;
      chart.update();
    } catch (err) {
      console.error("Lỗi fetch RSI:", err);
    }
  }

  updateRSI(); // chạy lần đầu
  const timerId = setInterval(updateRSI, interval * 1000);

  activeCharts[key] = { chart, timerId };
  saveChartsToStorage(); // lưu trạng thái
}

function removeChart(key) {
  const obj = activeCharts[key];
  if (!obj) return;

  clearInterval(obj.timerId);
  obj.chart.destroy();

  const chartDiv = document.getElementById(`chart-${key}`);
  if (chartDiv) chartDiv.remove();

  delete activeCharts[key];
  saveChartsToStorage(); // cập nhật lại
}
