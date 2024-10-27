package storage

import (
	"context"
	"fmt"
	"food-swipe.app/common"
	sq "github.com/Masterminds/squirrel"
)

type GetAllOptions struct {
	Search *string
	Sort   *string
	Order  *string
	Page   uint
	Amount uint
}

func (s *Storage) temp(options GetAllOptions) {
	// This is a temporary function to make the code compile
	sortColumn := getSortColumn(options.Sort)
	sortOrder := getSortOrder(options.Order)
	stmtData := []interface{}{}
	params := 1
	sql := "select * from ingredients"
	if options.Search != nil {
		sql = sql + fmt.Sprintf(" where name ILIKE $%d", params)
		params++
		stmtData = append(stmtData, *options.Search)
	}
	sql = sql + fmt.Sprintf(" order by %s %s", sortColumn, sortOrder)
	sql = sql + fmt.Sprintf(" limit $%d", params)
	params++
	sql = sql + fmt.Sprintf(" offset $%d", params)

	offset := (options.Page - 1) * options.Amount
	stmtData = append(stmtData, options.Amount, offset)

	rows, err := s.db.Query(context.Background(), sql, stmtData...)
}

func (s *Storage) GetAll(options GetAllOptions) (*common.PaginatedResult[*Ingredient], error) {

	sortColumn := getSortColumn(options.Sort)
	sortOrder := getSortOrder(options.Order)
	offset := (options.Page - 1) * options.Amount
	stmtData := sq.Select(ingredientFields...).From("ingredients").Limit(uint64(options.Amount)).Offset(uint64(offset)).OrderBy(sortColumn + " " + sortOrder)
	stmtTotal := sq.Select("count(*) as total").From("ingredients")

	if options.Search != nil && *options.Search != "" {
		stmtData = stmtData.Where("name ILIKE ?", *options.Search)
		stmtTotal = stmtTotal.Where("name ILIKE ?", *options.Search)
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
	var ingredients []*Ingredient
	for rows.Next() {
		ingredient, err := scanIntoIngredient(rows)
		if err != nil {
			return nil, err
		}
		ingredients = append(ingredients, ingredient)
	}
	pagination := common.CreatePagination(total, options.Amount, options.Page)
	return &common.PaginatedResult[*Ingredient]{
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
