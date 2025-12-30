package measurement

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Measurement) ListMeasurements(ctx context.Context, req *v1.ListMeasurementsRequest) (*v1.ListMeasurementsResponse, error) {
	paginated, err := a.core.ListMeasurements(ctx, models.ListMeasurements{
		Limit:  req.Limit,
		Page:   req.Page,
		Search: req.Search,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}
	grpcMeasurements := make([]*v1.Measurement, len(paginated.Data))
	for i, measurement := range paginated.Data {
		grpcMeasurements[i] = modelMeasurementToGrpcMeasurement(measurement)
	}
	return &v1.ListMeasurementsResponse{
		Pagination: paginated.Pagination.ToGrpcPagination(),
		Data:       grpcMeasurements,
	}, nil
}
