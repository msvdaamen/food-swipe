package measurement

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Measurement) CreateMeasurement(ctx context.Context, req *v1.CreateMeasurementRequest) (*v1.CreateMeasurementResponse, error) {
	measurement, err := a.core.CreateMeasurement(ctx, models.CreateMeasurement{
		Name:         req.Name,
		Abbreviation: req.Abbreviation,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.CreateMeasurementResponse{
		Measurement: modelMeasurementToGrpcMeasurement(measurement),
	}, nil
}
