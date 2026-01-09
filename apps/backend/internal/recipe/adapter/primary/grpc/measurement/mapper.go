package measurement

import (
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func modelMeasurementToGrpcMeasurement(measurement models.Measurement) *v1.Measurement {
	return &v1.Measurement{
		Id:           uint32(measurement.ID),
		Name:         measurement.Name,
		Abbreviation: measurement.Abbreviation,
	}
}
