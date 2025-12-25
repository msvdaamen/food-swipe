package main

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func setupDatabaseConnection(url string) (*pgxpool.Pool, error) {
	conn, err := pgxpool.New(context.Background(), url)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}
	return conn, nil
}
