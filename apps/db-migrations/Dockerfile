FROM golang:1.25-bookworm

WORKDIR /src

# Cache deps first
COPY go.mod go.sum ./
RUN go mod download

RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# Copy source
COPY . .

ENTRYPOINT ["goose", "up"]
