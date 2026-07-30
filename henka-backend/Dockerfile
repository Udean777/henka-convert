# STAGE 1: Builder (Kompilasi kode Go)
# ==========================================
FROM golang:1.26-bookworm AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
# Compile Go menjadi binary statis (bernama 'server')
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# ==========================================
# STAGE 2: Runner (OS Ringan + LibreOffice)
# ==========================================
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Instal LibreOffice Headless (tanpa GUI) & Font standar
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-core \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    fonts-liberation \
    ca-certificates \
    ffmpeg \
    python3 \
    python3-mutagen \
    curl \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install versi terbaru yt-dlp langsung dari GitHub (apt package biasanya kadaluarsa)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp


WORKDIR /app

# Salin HANYA file binary dari STAGE 1 ke STAGE 2
COPY --from=builder /app/server .

# Buat folder khusus tempat LibreOffice akan menyimpan file sementaranya
RUN mkdir -p /tmp/libreoffice && chmod 777 /tmp/libreoffice

EXPOSE 8080

# Jalankan server
CMD ["./server"]
