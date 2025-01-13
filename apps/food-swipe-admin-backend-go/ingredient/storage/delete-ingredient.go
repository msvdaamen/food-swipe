package storage

import "context"

func (s *Storage) DeleteIngredient(id int32) error {
	sql := `delete from ingredients where id = $1`
	_, err := s.db.Exec(context.Background(), sql, id)
	if err != nil {
		return err
	}
	return nil
}
