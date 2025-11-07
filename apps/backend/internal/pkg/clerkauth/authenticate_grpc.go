package clerkauth

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	userModel "github.com/msvdaamen/food-swipe/internal/app/user/core/model"
	"github.com/msvdaamen/food-swipe/internal/pkg/auth"
	"github.com/msvdaamen/food-swipe/internal/pkg/clerkauth/model"
)

var ErrNoCallinfoForHandlerContext = errors.New("can't access headers: no CallInfo for handler context")

func (a *Auth) AuthenticateGRPC(ctx context.Context) (*userModel.User, error) {
	callInfo, ok := connect.CallInfoForHandlerContext(ctx)
	if !ok {
		return nil, ErrNoCallinfoForHandlerContext
	}
	authorizationHeader := callInfo.RequestHeader().Get("Authorization")
	if authorizationHeader == "" {
		return nil, auth.ErrUnauthorized
	}
	sessionTokenSlice := strings.Split(authorizationHeader, " ")
	if len(sessionTokenSlice) != 2 {
		return nil, auth.ErrUnauthorized
	}
	sessionToken := sessionTokenSlice[1]
	claims, err := a.verifyJWT(ctx, sessionToken)
	if err != nil {
		return nil, auth.ErrUnauthorized
	}

	user, err := a.user.GetUserByAuthId(ctx, claims.Subject)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		a.logger.Info(fmt.Sprintf("Failed to check user existence: %v", err))
		return nil, auth.ErrUnauthorized
	}
	if err != nil {
		customClaims, ok := claims.Custom.(*model.CustomSessionClaims)
		if !ok {
			a.logger.Info("has no custom claims")
			return nil, auth.ErrUnauthorized
		}
		id, err := uuid.NewV7()
		if err != nil {
			return nil, auth.ErrUnauthorized
		}
		createdUser, err := a.user.CreateUser(ctx, &userModel.CreateUserPayload{
			ID:     id.String(),
			AuthID: claims.Subject,
			Email:  customClaims.PrimaryEmail,
		})
		if err != nil {
			a.logger.Info("failed to create user")
			return nil, auth.ErrUnauthorized
		}

		return &createdUser, nil
	}
	return &user, nil
}
