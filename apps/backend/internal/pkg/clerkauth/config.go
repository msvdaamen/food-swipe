package clerkauth

type Config struct {
	SecretKey      string `env:"CLERK_SECRET_KEY"`
	PublishableKey string `env:"CLERK_PUBLISHABLE_KEY"`
}
