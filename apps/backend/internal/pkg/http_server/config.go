package http_server

type Config struct {
	Port string `env:"PORT" env-default:"3004"`
}
