package common

import (
	"math"
)

type Pagination struct {
	PerPage     uint `json:"perPage"`
	TotalPages  uint `json:"totalPages"`
	CurrentPage uint `json:"currentPage"`
	Total       uint `json:"total"`
}

type PaginatedResult[T any] struct {
	Data       []T        `json:"data"`
	Pagination Pagination `json:"pagination"`
}

func CreatePagination(total uint, limit uint, currentPage uint) Pagination {
	return Pagination{
		PerPage:     limit,
		TotalPages:  uint(math.Ceil(float64(total / limit))),
		CurrentPage: currentPage,
		Total:       total,
	}
}
