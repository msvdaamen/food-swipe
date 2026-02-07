package testhelpers

import (
	"context"
	"database/sql"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
)

type TestDatabase struct {
	container *postgres.PostgresContainer
	connStr   string
}

func (td *TestDatabase) Setup(t *testing.T) *pgxpool.Pool {
	ctx := context.Background()
	pool, err := pgxpool.New(ctx, td.connStr)
	require.NoError(t, err)
	t.Cleanup(func() {
		pool.Close()
		err := td.container.Restore(ctx)
		require.NoError(t, err)
	})
	return pool
}

func SetupTestDatabase(t *testing.T) *TestDatabase {
	t.Helper()
	ctx := context.Background()

	container, err := postgres.Run(ctx,
		"postgres:18-bookworm",
		postgres.WithDatabase("testdb"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		postgres.WithSQLDriver("pgx"),
		postgres.BasicWaitStrategies(),
	)
	testcontainers.CleanupContainer(t, container)
	require.NoError(t, err)

	connStr, err := container.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		t.Fatalf("failed to get connection string: %v", err)
	}
	runMigrations(t, connStr)

	err = container.Snapshot(ctx)
	require.NoError(t, err)

	return &TestDatabase{
		container: container,
		connStr:   connStr,
	}
}

func runMigrations(t *testing.T, connStr string) {
	t.Helper()

	db, err := sql.Open("pgx", connStr)
	if err != nil {
		t.Fatalf("failed to open sql connection for migrations: %v", err)
	}
	defer db.Close()

	// Resolve the migrations directory relative to this source file,
	// so it works regardless of where `go test` is invoked from.
	_, thisFile, _, _ := runtime.Caller(0)
	migrationsDir := filepath.Join(filepath.Dir(thisFile), "..", "..", "..", "migrations")

	if err := goose.SetDialect("postgres"); err != nil {
		t.Fatalf("failed to set goose dialect: %v", err)
	}

	if err := goose.Up(db, migrationsDir); err != nil {
		t.Fatalf("failed to run goose migrations: %v", err)
	}
}
