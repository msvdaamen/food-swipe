package storage

import (
	"context"
	"food-swipe.app/common"
	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
)

type GetAllOptions struct {
	Search *string
	Sort   *string
	Order  *string
	Page   uint
	Amount uint
}

func (s *Storage) GetAll(options GetAllOptions) (*common.PaginatedResult[Ingredient], error) {

	sortColumn := getSortColumn(options.Sort)
	sortOrder := getSortOrder(options.Order)
	offset := (options.Page - 1) * options.Amount
	stmtData := sq.Select(ingredientFields...).From("ingredients").Limit(uint64(options.Amount)).Offset(uint64(offset)).OrderBy(sortColumn + " " + sortOrder)
	stmtTotal := sq.Select("count(*) as total").From("ingredients")

	if options.Search != nil && *options.Search != "" {
		search := "%" + *options.Search + "%"
		stmtData = stmtData.Where("name ILIKE $1", search)
		stmtTotal = stmtTotal.Where("name ILIKE $1", search)
	}
	sql, args, err := stmtData.ToSql()
	rows, err := s.db.Query(context.Background(), sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	sqlTotal, argsTotal, err := stmtTotal.ToSql()
	rowTotal := s.db.QueryRow(context.Background(), sqlTotal, argsTotal...)
	var total uint
	err = rowTotal.Scan(&total)
	if err != nil {
		return nil, err
	}
	ingredients, err := pgx.CollectRows(rows, pgx.RowToStructByName[Ingredient])
	if err != nil {
		return nil, err
	}
	pagination := common.CreatePagination(total, options.Amount, options.Page)
	return &common.PaginatedResult[Ingredient]{
		Data:       ingredients,
		Pagination: pagination,
	}, nil
}

func getSortColumn(sort *string) string {
	if sort == nil {
		return "id"
	}
	switch *sort {
	case "name":
		return "name"
	default:
		return "id"
	}
}

func getSortOrder(order *string) string {
	if order == nil {
		return "ASC"
	}
	switch *order {
	case "desc":
		return "DESC"
	default:
		return "ASC"
	}
}
