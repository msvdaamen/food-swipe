package storage_test

import (
	"testing"

	testhelpers "github.com/food-swipe/internal/pkg/test"
	"github.com/food-swipe/internal/user/adapters/secondary/storage"
	"github.com/stretchr/testify/assert"
)

func TestAdapter(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)
	pool := container.Setup(t)
	adapter := storage.New(pool)
	assert.NotNil(t, adapter)
}
