package grpc_server

type Config struct {
	ListenAddress string `env:"GRPC_LISTEN_ADDRESS" env-default:"0.0.0.0"`
	ListenPort    int    `env:"GRPC_LISTEN_PORT" env-default:"8080"`
}
