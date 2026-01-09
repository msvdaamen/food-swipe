package measurement

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Measurement) DeleteMeasurement(ctx context.Context, req *v1.DeleteMeasurementRequest) (*v1.DeleteMeasurementResponse, error) {
	err := a.core.DeleteMeasurement(ctx, uint16(req.Id))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}
	return &v1.DeleteMeasurementResponse{}, nil
}
