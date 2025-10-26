package config

import (
	"errors"
	"fmt"

	"github.com/ilyakaznacheev/cleanenv"
)

var (
	errFailedToLoad = errors.New("failed to load configuration")
)

// Load loads the configuration from the environment
func Load[T any]() (T, error) {
	var config T

	err := cleanenv.ReadEnv(&config)
	if err != nil {
		return config, fmt.Errorf("%w: %w", errFailedToLoad, err)
	}

	return config, nil
}
