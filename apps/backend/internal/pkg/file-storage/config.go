package filestorage

type Config struct {
	PublicUrl       string `env:"STORAGE_PUBLIC_URL"`
	AccessKeyID     string `env:"STORAGE_ACCESS_KEY_ID"`
	SecretAccessKey string `env:"STORAGE_SECRET_ACCESS_KEY"`
	Bucket          string `env:"STORAGE_BUCKET"`
	Endpoint        string `env:"STORAGE_ENDPOINT"`
}
