package service

func (s *Service) SignOut(userId int32) error {
	return s.storage.DeleteRefreshTokenByUserId(userId)
}
