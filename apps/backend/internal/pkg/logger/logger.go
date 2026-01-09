package logger

import (
	"errors"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// LogMode is the application log output mode
type LogMode int

const (
	// LogModeProduction is the production log mode
	LogModeProduction LogMode = iota
	// LogModeDevelopment is the development log mode
	LogModeDevelopment
)

func (t LogMode) String() string {
	switch t {
	case LogModeProduction:
		return "production"
	case LogModeDevelopment:
		return "development"
	default:
		return "unknown"
	}
}

// Setup configures a new logger for a chosen log mode
func Setup(logMode LogMode) (*zap.Logger, error) {
	var logger *zap.Logger
	var err error

	switch logMode {
	case LogModeProduction:
		logger, err = zap.NewProduction()
	case LogModeDevelopment:
		config := zap.NewDevelopmentConfig()
		config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
		logger, err = config.Build()
	default:
		return nil, errors.New("unsupported log mode")
	}

	if logger != nil {
		logger.Debug("Initialized logger", zap.String("mode", logMode.String()))
	}

	return logger, err
}
