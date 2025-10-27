package primary

import (
	"github.com/labstack/echo/v4"
	todo "github.com/msvdaamen/food-swipe/internal/app/todo/core"
	auth "github.com/msvdaamen/food-swipe/internal/pkg/auth"
)

type Adapter struct {
	core *todo.Core
}

func New(http *echo.Echo, core *todo.Core, auth auth.Auth) *Adapter {
	http.Use(auth.Middleware)
	adapter := &Adapter{
		core: core,
	}
	return adapter
}

// func (a *Adapter) Greet(ctx context.Context, req *api.GreetRequest) (*api.GreetResponse, error) {
// 	if _, err := a.auth.AuthenticateGRPC(ctx); err != nil {
// 		return nil, connect.NewError(connect.CodeUnauthenticated, err)
// 	}

// 	return &api.GreetResponse{
// 		Message: "Hello, " + req.Name,
// 	}, nil
// }
