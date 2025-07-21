async function addRSIChart(token) {
  console.log("📥 Hàm addRSIChart được gọi với token:", token);

  const interval = 60;
  const url = `/rsi?tokens=${token}&interval=${interval}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("📊 Dữ liệu nhận từ API:", data);

    const rsiValue = data[token][`rsi_${interval}s`];
    console.log("✅ RSI Value là:", rsiValue);

    const container = document.getElementById("rsiCharts");
    if (!container) {
      console.error("❌ Không tìm thấy #rsiCharts trong HTML!");
      return;
    }

    const chartDiv = document.createElement("div");
    chartDiv.innerHTML = `
      <h4>${token} - RSI ${interval}s</h4>
      <p><strong>${rsiValue}</strong></p>
    `;
    container.appendChild(chartDiv);
    console.log("✅ Thêm thành công chart vào DOM");

  } catch (err) {
    console.error("❌ Lỗi khi fetch hoặc xử lý JSON:", err);
  }
}
