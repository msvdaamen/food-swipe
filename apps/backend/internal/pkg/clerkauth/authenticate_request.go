package clerkauth

import (
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	userModel "github.com/msvdaamen/food-swipe/internal/app/user/core/model"
	"github.com/msvdaamen/food-swipe/internal/pkg/auth"
	"github.com/msvdaamen/food-swipe/internal/pkg/clerkauth/model"
)

var ErrNoCallinfoForHandlerContext = errors.New("can't access headers: no CallInfo for handler context")

func (a *Auth) AuthenticateRequest(ctx echo.Context) (*auth.User, error) {
	authorizationHeader := ctx.Request().Header.Get("Authorization")
	if authorizationHeader == "" {
		return nil, auth.ErrUnauthorized
	}
	sessionTokenSlice := strings.Split(authorizationHeader, " ")
	if len(sessionTokenSlice) != 2 {
		return nil, auth.ErrUnauthorized
	}
	sessionToken := sessionTokenSlice[1]
	claims, err := a.verifyJWT(ctx.Request().Context(), sessionToken)
	if err != nil {
		return nil, auth.ErrUnauthorized
	}

	userExists, err := a.user.ExistsByAuthId(ctx.Request().Context(), claims.Subject)
	if err != nil {
		a.logger.Sugar().Infof("Failed to check user existence: %v", err)
		return nil, auth.ErrUnauthorized
	}
	if !userExists {
		customClaims, ok := claims.Custom.(*model.CustomSessionClaims)
		if !ok {
			a.logger.Info("has no custom claims")
			return nil, auth.ErrUnauthorized
		}
		id, err := uuid.NewV7()
		if err != nil {
			return nil, auth.ErrUnauthorized
		}
		createdUser, err := a.user.CreateUser(ctx.Request().Context(), &userModel.CreateUserPayload{
			ID:     id.String(),
			AuthID: claims.Subject,
			Email:  customClaims.PrimaryEmail,
		})
		if err != nil {
			a.logger.Info("failed to create user")
			return nil, auth.ErrUnauthorized
		}
		authUser := &auth.User{
			ID: createdUser.ID,
		}

		return authUser, nil
	}

	authUser := &auth.User{
		ID: claims.Subject,
	}

	return authUser, nil
}
