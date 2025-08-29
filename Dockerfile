FROM python:3.12-alpine

WORKDIR /app

# Sherlock viene installato da Git → serve git
RUN apk add --no-cache git

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend .
EXPOSE 3000

CMD ["python", "app.py"]
