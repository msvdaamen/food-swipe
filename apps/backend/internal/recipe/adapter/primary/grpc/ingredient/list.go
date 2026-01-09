package ingredient

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Ingredient) ListIngredients(ctx context.Context, req *v1.ListIngredientsRequest) (*v1.ListIngredientsResponse, error) {
	paginated, err := a.core.ListIngredients(ctx, models.ListIngredients{
		Limit:  req.Limit,
		Page:   req.Page,
		Search: req.Search,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}
	grpcIngredients := make([]*v1.Ingredient, len(paginated.Data))
	for i, ingredient := range paginated.Data {
		grpcIngredients[i] = modelIngredientToGrpcIngredient(ingredient)
	}
	return &v1.ListIngredientsResponse{
		Pagination: paginated.Pagination.ToGrpcPagination(),
		Data:       grpcIngredients,
	}, nil
}
