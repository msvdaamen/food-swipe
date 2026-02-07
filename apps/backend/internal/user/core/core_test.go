package core

import (
	"testing"

	"github.com/food-swipe/internal/user/core/port/mocks"
	"github.com/stretchr/testify/assert"
)

func TestCore(t *testing.T) {
	storageMock := mocks.NewStorage(t)
	core := New(storageMock)
	assert.NotNil(t, core)
}
