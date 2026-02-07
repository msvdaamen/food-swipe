package user

import (
	apiClient "github.com/food-swipe/gen/grpc/food-swipe/v1/foodswipev1connect"
)

type Adapter struct {
	client apiClient.UserServiceClient
}

func New(client apiClient.UserServiceClient) *Adapter {
	return &Adapter{
		client: client,
	}
}
