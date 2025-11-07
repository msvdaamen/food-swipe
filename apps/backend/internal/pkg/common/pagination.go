package common

type Pagination struct {
	PerPage     int32 `json:"perPage"`
	TotalPages  int32 `json:"totalPages"`
	CurrentPage int32 `json:"currentPage"`
	Total       int32 `json:"total"`
}

type PaginationData[T any] struct {
	Data       []T        `json:"data"`
	Pagination Pagination `json:"pagination"`
}
