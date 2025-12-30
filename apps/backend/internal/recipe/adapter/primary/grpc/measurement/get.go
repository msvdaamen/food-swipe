package measurement

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Measurement) GetMeasurement(ctx context.Context, req *v1.GetMeasurementRequest) (*v1.GetMeasurementResponse, error) {
	measurement, err := a.core.GetMeasurement(ctx, uint16(req.Id))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}
	return &v1.GetMeasurementResponse{
		Measurement: modelMeasurementToGrpcMeasurement(measurement),
	}, nil
}
