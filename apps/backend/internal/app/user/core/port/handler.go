package port

import (
	"context"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
	"github.com/msvdaamen/food-swipe/internal/pkg/common"
)

type Handler interface {
	GetUsers(ctx context.Context, page int32, limit int32) (common.PaginationData[model.User], error)
}
