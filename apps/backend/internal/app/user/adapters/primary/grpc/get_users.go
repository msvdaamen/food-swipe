package grpc

import (
	"context"
	"fmt"

	apiv1 "github.com/msvdaamen/food-swipe/gen/api/v1"
	"github.com/msvdaamen/food-swipe/gen/api/v1/common"
)

func (a *Adapter) GetUsers(ctx context.Context, req *apiv1.GetUsersRequest) (*apiv1.GetUsersResponse, error) {
	paginatedData, err := a.core.GetUsers(ctx, req.Page, req.Limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get users: %w", err)
	}

	apiUsers := make([]*apiv1.User, len(paginatedData.Data))
	for i, user := range paginatedData.Data {
		apiUsers[i] = &apiv1.User{
			Id:        user.ID,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
		}
	}
	return &apiv1.GetUsersResponse{
		Users: apiUsers,
		Pagination: &common.Pagination{
			PerPage:     paginatedData.Pagination.PerPage,
			TotalPages:  paginatedData.Pagination.TotalPages,
			CurrentPage: paginatedData.Pagination.CurrentPage,
			Total:       paginatedData.Pagination.Total,
		},
	}, nil
}
