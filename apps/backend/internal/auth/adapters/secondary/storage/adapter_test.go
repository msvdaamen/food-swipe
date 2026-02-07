package storage_test

import (
	"testing"

	"github.com/food-swipe/internal/auth/adapters/secondary/storage"
	testhelpers "github.com/food-swipe/internal/pkg/test"
	"github.com/stretchr/testify/assert"
)

func TestAdapter(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)
	dbPool := container.Setup(t)
	adapter := storage.New(dbPool)
	assert.NotNil(t, adapter)
}
