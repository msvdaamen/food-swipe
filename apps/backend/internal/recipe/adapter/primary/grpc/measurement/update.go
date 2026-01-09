package measurement

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Measurement) UpdateMeasurement(ctx context.Context, req *v1.UpdateMeasurementRequest) (*v1.UpdateMeasurementResponse, error) {
	measurement, err := a.core.UpdateMeasurement(ctx, uint16(req.Id), models.UpdateMeasurement{
		Name:         req.Name,
		Abbreviation: req.Abbreviation,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}
	return &v1.UpdateMeasurementResponse{
		Measurement: modelMeasurementToGrpcMeasurement(measurement),
	}, nil
}
