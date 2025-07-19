# Token Dashboard

## Mô tả
Dự án web Flask cho phép tìm kiếm token, quản lý watchlist, và xem chỉ số RSI nhiều cặp token. Giao diện đơn giản, dễ mở rộng.

## Chức năng chính
- Tìm kiếm token và hiển thị cặp giao dịch (mock data)
- Thêm/xem watchlist các cặp token
- Xem biểu đồ mock và chỉ số RSI (giả lập)

## Cài đặt
1. Clone repo về máy:
```bash
git clone <repo-url>
cd task4
```
2. Cài đặt Python 3.8+ và pip
3. Cài đặt thư viện:
```bash
pip install -r requirements.txt
```

## Chạy ứng dụng
```bash
python run.py
```
Truy cập: http://127.0.0.1:5000

## Cấu trúc thư mục
```
project/
├── run.py
├── requirements.txt
├── Dockerfile
├── app/
│   ├── __init__.py
│   ├── routes/
│   ├── services/
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── templates/
```

## Ghi chú
- Dữ liệu hiện tại là mock, có thể tích hợp API thực tế.
- Watchlist lưu tạm trên RAM (chưa có database).
- Có thể mở rộng thêm xác thực, lưu trữ DB, biểu đồ thực tế...

## Triển khai lên Google Cloud Run
1. **Tạo file Dockerfile** (nếu chưa có):
```Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
ENV PORT=8080
CMD ["python", "run.py"]
```
2. **Khuyên dùng .dockerignore** để loại trừ file không cần thiết khỏi image:
```
.git
__pycache__
*.pyc
*.pyo
*.pyd
.env
.venv
venv
ENV
*.sqlite3
*.log
.vscode
```
3. **Build và deploy:**
- Đăng nhập Google Cloud, chọn project, bật Cloud Run và Container Registry.
- Build image:
```bash
gcloud builds submit --tag gcr.io/<PROJECT_ID>/token-dashboard
```
- Deploy lên Cloud Run:
```bash
gcloud run deploy token-dashboard \
  --image gcr.io/<PROJECT_ID>/token-dashboard \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```
- Sau khi deploy thành công, bạn sẽ nhận được URL public của app.

**Lưu ý:**
- `run.py` đã tự động lấy PORT từ biến môi trường, phù hợp Cloud Run.
- Thay `<PROJECT_ID>` bằng project ID thực tế của bạn. 