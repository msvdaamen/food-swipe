# syntax=docker/dockerfile:1

# Build stage
FROM golang:1.25-bookworm AS builder

WORKDIR /src

# Cache deps first
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build a static-ish binary (CGO disabled) suitable for distroless
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o /out/follow ./main.go


# Runtime stage
FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /

COPY --from=builder /out/follow /follow

# The service listens on 3001 (see main.go)
EXPOSE 3001

USER nonroot:nonroot

ENTRYPOINT ["/follow"]
