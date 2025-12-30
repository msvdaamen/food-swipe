package pagination

import (
	"math"

	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

type Pagination struct {
	PerPage     uint32
	TotalPages  uint32
	CurrentPage uint32
	Total       uint32
}

type PaginationResponse[T any] struct {
	Pagination Pagination
	Data       []T
}

func New[T any](data []T, total uint32, page uint32, limit uint32) *PaginationResponse[T] {
	return &PaginationResponse[T]{
		Pagination: Pagination{
			PerPage:     limit,
			TotalPages:  uint32(math.Ceil(float64(total) / float64(limit))),
			CurrentPage: page,
			Total:       total,
		},
		Data: data,
	}
}

func (p Pagination) ToGrpcPagination() *v1.Pagination {
	return &v1.Pagination{
		PerPage:     p.PerPage,
		TotalPages:  p.TotalPages,
		CurrentPage: p.CurrentPage,
		Total:       p.Total,
	}
}
