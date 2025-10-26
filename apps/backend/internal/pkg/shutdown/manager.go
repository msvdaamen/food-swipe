package shutdown

import (
	"context"
	"os/signal"
	"syscall"

	"go.uber.org/zap"
)

type ShutdownTask func() error

// Manager coordinates shutdown tasks
type Manager struct {
	logger                  *zap.Logger
	tasks                   map[string]ShutdownTask
	cancelFn                context.CancelFunc
	shutdownCompleteChannel chan struct{}
}

func New(ctx context.Context, logger *zap.Logger) (manager *Manager, shutdownCompleteChannel chan struct{}) {
	shutdownCtx, cancelFn := signal.NotifyContext(ctx, syscall.SIGINT, syscall.SIGTERM)

	shutdownCompleteChannel = make(chan struct{})

	manager = &Manager{
		logger:                  logger,
		tasks:                   make(map[string]ShutdownTask),
		cancelFn:                cancelFn,
		shutdownCompleteChannel: shutdownCompleteChannel,
	}

	go func() {
		<-shutdownCtx.Done()
		manager.logger.Info("Shutting down")
		numTasks := len(manager.tasks)
		taskErrors := manager.executeTasks()
		if len(taskErrors) > 0 {
			joinedErrors := taskErrorsToError(taskErrors)
			manager.logger.Error("Shutdown failed", zap.Error(joinedErrors))
		} else {
			manager.logger.Info("Shutdown complete, ran tasks", zap.Int("tasks", numTasks))
		}

		// Inform the main goroutine that shutdown is complete
		close(shutdownCompleteChannel)
	}()

	return manager, shutdownCompleteChannel
}
