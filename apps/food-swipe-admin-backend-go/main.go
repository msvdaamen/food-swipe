package main

import (
	"context"
	"fmt"
	"food-swipe.app/auth"
	"food-swipe.app/auth/middleware"
	AuthService "food-swipe.app/auth/service"
	"food-swipe.app/common/jwt"
	"food-swipe.app/ingredient"
	IngredientService "food-swipe.app/ingredient/service"
	"food-swipe.app/user"
	UserService "food-swipe.app/user/service"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"log"
	"os"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dbPool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Printf("Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer dbPool.Close()

	jwtService := jwt.NewJwt("gsudykfhgbvzmaysgioufamuwhfldkcjnfstalwuvnfwegfyiuakjvapioweuropnvcifpasuhfkuhvsf")
	userService := UserService.NewService(dbPool)
	authService := AuthService.NewService(dbPool, userService, jwtService)
	ingredientService := IngredientService.NewService(dbPool)

	app := fiber.New(fiber.Config{
		// Global custom error handler
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
				Error: err.Error(),
			})
		},
	})

	app.Use(helmet.New())
	app.Use(cors.New())
	//app.Use(compress.New())
	app.Use(limiter.New(limiter.Config{
		Max: 60,
		KeyGenerator: func(c *fiber.Ctx) string {
			cfConnectingIp := c.Get("cf-connecting-ip")
			if cfConnectingIp != "" {
				return cfConnectingIp
			}
			realIp := c.Get("x-forwarded-for")
			if realIp != "" {
				return realIp
			}
			return c.IP()
		},
	}))

	authMiddleware := middleware.CreateAuthMiddleware(jwtService, userService)

	api := app.Group("/v1")

	auth.Init(api, authMiddleware, authService)
	user.Init(api, authMiddleware, userService)
	ingredient.Init(api, authMiddleware, ingredientService)

	port := "3000"
	if portEnv, exists := os.LookupEnv("APP_PORT"); exists {
		port = portEnv
	}
	portStr := fmt.Sprintf(":%v", port)
	log.Fatal(app.Listen(portStr))
}
