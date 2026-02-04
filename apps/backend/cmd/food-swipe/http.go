package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/food-swipe/internal/pkg/i18n"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
	nl_translations "github.com/go-playground/validator/v10/translations/nl"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"go.uber.org/zap"
)

type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
	Code    string `json:"code"`
}

type ValidationErrorResponse struct {
	Message string            `json:"message"`
	Errors  []ValidationError `json:"errors"`
}

type CustomValidator struct {
	validator *validator.Validate
	trans     ut.Translator
}

func (cv *CustomValidator) Validate(i any) error {
	if err := cv.validator.Struct(i); err != nil {
		return echo.ErrBadRequest.Wrap(err)
	}
	return nil
}

type HttpServer struct {
	Echo   *echo.Echo
	port   string
	Server *http.Server
	logger *zap.Logger
}

func setupHttpServer(port string, i18nProvider *i18n.Provider, logger *zap.Logger) *HttpServer {
	validator := validator.New()
	enTrans, _ := i18nProvider.GetTranslator("en")
	nlTrans, _ := i18nProvider.GetTranslator("nl")
	en_translations.RegisterDefaultTranslations(validator, enTrans)
	nl_translations.RegisterDefaultTranslations(validator, nlTrans)

	e := echo.New()
	e.Validator = &CustomValidator{validator: validator}
	e.Use(middleware.RequestLogger())
	e.Use(middleware.BodyLimit(2_097_152)) // 2MB
	e.Use(validationMiddleware(i18nProvider))

	s := http.Server{Addr: ":" + port, Handler: e}
	return &HttpServer{
		Echo:   e,
		port:   port,
		Server: &s,
		logger: logger,
	}
}

func (h *HttpServer) Start() {
	go func() {
		h.logger.Info("Starting HTTP server on: " + h.port)
		if err := h.Server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("HTTP start error: %v", err)
		}
	}()
}

func (s *HttpServer) Shutdown(ctx context.Context) error {
	return s.Server.Shutdown(ctx)
}

func validationMiddleware(i18n *i18n.Provider) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			// For valid credentials call next
			response := next(c)
			var validationErr validator.ValidationErrors
			if errors.As(response, &validationErr) {
				errors := make([]ValidationError, 0, len(validationErr))

				for _, err := range validationErr {
					translator, found := i18n.GetTranslator(c.Request().Header.Get("Accept-Language"))
					if !found {
						translator, _ = i18n.GetTranslator("en")
					}
					message := err.Translate(translator)

					errors = append(errors, ValidationError{
						Field:   err.Field(),
						Message: message,
						Code:    err.Tag(),
					})
				}

				response := ValidationErrorResponse{
					Message: "Validation failed",
					Errors:  errors,
				}
				return c.JSON(http.StatusBadRequest, response)
			}
			return response
		}
	}
}
