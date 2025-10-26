package shutdown

import "os"

// Shutdown triggers a graceful shutdown
func (manager *Manager) Shutdown(err error) {
	manager.cancelFn()
	<-manager.shutdownCompleteChannel

	_ = manager.logger.Sync()

	if err != nil {
		os.Exit(1)
		return
	}

	os.Exit(0)
}
