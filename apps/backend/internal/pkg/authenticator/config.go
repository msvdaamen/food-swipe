package authenticator

type Config struct {
	JwtSecret string `env:"JWT_SECRET"`
}
