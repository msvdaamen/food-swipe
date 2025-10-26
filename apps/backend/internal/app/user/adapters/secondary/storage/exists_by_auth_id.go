package storage

import "context"

const existsByAuthIdQuery = `SELECT EXISTS(SELECT 1 FROM users WHERE auth_id = $1)`

func (s *Storage) ExistsByAuthId(ctx context.Context, authId string) (bool, error) {
	var exists bool
	err := s.database.QueryRow(ctx, existsByAuthIdQuery, authId).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}
