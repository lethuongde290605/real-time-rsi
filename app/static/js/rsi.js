// app/static/js/rsi.js

// Global
const activeCharts = {};  // token_interval -> {chart, timerId}

// Lưu & khôi phục
function saveChartsToStorage() {
  localStorage.setItem("activeCharts", JSON.stringify(Object.keys(activeCharts)));
}

async function restoreChartsFromStorage() {
  const saved = localStorage.getItem("activeCharts");
  if (!saved) return;
  const keys = JSON.parse(saved);

  const res = await fetch("/rsi_data?interval=60");
  const allRSIData = await res.json();

  keys.forEach(key => {
    const [token, interval] = key.split("_");
    const chart = addRSIChart(token, parseInt(interval));
    const rsiList = allRSIData[token]?.[`rsi_${interval}s`];

    if (chart && rsiList) {
      for (const [ts, val] of rsiList) {
        chart.data.labels.push(new Date(ts * 1000).toLocaleTimeString());
        chart.data.datasets[0].data.push(val);
      }
      chart.update();
    }
  });
}

async function loadHistoryAndDraw(token, interval, chart) {
  try {
    const res = await fetch(`/rsi_history?token=${token}&interval=${interval}`);
    const history = await res.json();

    if (!Array.isArray(history)) return;

    history.forEach(item => {
      chart.data.labels.push(new Date(item.t * 1000).toLocaleTimeString());
      chart.data.datasets[0].data.push(item.rsi);
    });

    chart.update();
  } catch (err) {
    console.error(`❌ Không thể tải dữ liệu RSI cũ cho ${token}:`, err);
  }
}


// Hàm cập nhật chart
async function updateRSIChart(token, interval, chart) {
  try {
    const res = await fetch(`/rsi?tokens=${token}&interval=${interval}`);
    const data = await res.json();
    const rsiValue = data[token]?.[`rsi_${interval}s`];

    if (rsiValue === undefined) {
      console.warn(`⚠️ No RSI data for ${token} (${interval}s)`);
      return;
    }

    // Thêm dữ liệu mới vào chart
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(rsiValue);

    // Giới hạn hiển thị 100 điểm
    if (chart.data.datasets[0].data.length > 100) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    chart.update();
  } catch (err) {
    console.error(`❌ Error updating ${token} (${interval}s):`, err);
  }
}

// Hàm thêm chart mới
function addRSIChart(token, interval = 60) {
  const key = `${token}_${interval}`;
  
  // Không tạo thêm nếu đã tồn tại cặp đó
  if (activeCharts[key]) {
    return;
  }

  // Tạo HTML element
  const container = document.getElementById("rsiCharts");
  const chartDiv = document.createElement("div");
  chartDiv.className = "rsi-card";
  chartDiv.id = `chart-${key}`;
  chartDiv.innerHTML = `
    <h4>${token} - RSI ${interval}s 
      <button onclick="removeChart('${key}')">❌</button>
    </h4>
    <canvas id="canvas-${key}" height="100"></canvas>
  `;
  container.appendChild(chartDiv);

  // Khởi tạo Chart.js
  const ctx = document.getElementById(`canvas-${key}`).getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'RSI14',
        data: [],
        borderColor: getRandomColor(),
        tension: 0.2
      }]
    },
    options: { /*...*/ }
  });

  loadHistoryAndDraw(token, interval, chart);

  // Bắt đầu cập nhật định kỳ
  updateRSIChart(token, interval, chart); // Lần đầu
  const timerId = setInterval(
    () => updateRSIChart(token, interval, chart),
    interval * 1000
  );

  activeCharts[key] = { chart, timerId };
  saveChartsToStorage();
  return chart;
}

// Hàm phụ trợ tạo màu ngẫu nhiên
function getRandomColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

// Xóa chart
async function removeChart(key) {
  const obj = activeCharts[key];
  if (!obj) return;

  // Gọi API backend để hủy subscribe
  try {
    const [token, interval] = key.split('_');
    await fetch(`/unsubscribe?token=${token}`);
  } catch (err) {
    console.error("❌ Lỗi khi hủy subscribe:", err);
  }

  // Xóa chart
  clearInterval(obj.timerId);
  obj.chart.destroy();
  document.getElementById(`chart-${key}`)?.remove();
  delete activeCharts[key];
  saveChartsToStorage();
}

// Khôi phục chart khi load
window.onload = restoreChartsFromStorage;
