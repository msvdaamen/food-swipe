package storage

import "github.com/jackc/pgx/v5"

func scanIntoUser(row pgx.Row) (*User, error) {
	user := User{}
	err := row.Scan(
		&user.Id,
		&user.Email,
		&user.Username,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.IsAdmin,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	return &user, err
}
