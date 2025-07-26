# Sử dụng Python 3.10 image gọn nhẹ
FROM python:3.10-slim

# Đặt thư mục làm việc
WORKDIR /app

# Không tạo file .pyc
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Cài các package hệ thống nếu cần (tùy yêu cầu của app)
RUN apt-get update && apt-get install -y gcc && apt-get clean

# Cài requirements
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cloud Run mặc định truyền PORT=8080
EXPOSE 8080

# Chạy ứng dụng bằng gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--timeout", "120", "run:app"]
