package config

type Config struct {
	DatabaseURL string `env:"DATABASE_URL"`
}
