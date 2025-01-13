package ingredient

import (
	"food-swipe.app/ingredient/http"
	"food-swipe.app/ingredient/service"
	"github.com/gofiber/fiber/v2"
)

func Init(router fiber.Router, authMiddleware fiber.Handler, service *service.Service) {
	authGroup := router.Group("/ingredients")
	http.RegisterService(authGroup, authMiddleware, service)
}
