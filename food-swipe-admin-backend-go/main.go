package main

import (
	"context"
	"fmt"
	"food-swipe.app/user"
	"food-swipe.app/user/service"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Printf("Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	userService := service.NewService(dbpool)

	app := fiber.New()

	user.Init(app, userService)

	port := "3000"
	if portEnv, exists := os.LookupEnv("APP_PORT"); exists {
		port = portEnv
	}
	portStr := fmt.Sprintf(":%v", port)
	log.Fatal(app.Listen(portStr))
}
