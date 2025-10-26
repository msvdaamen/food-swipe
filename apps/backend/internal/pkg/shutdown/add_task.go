package shutdown

// SetTask adds a shutdown task to the manager
// If a task with the same name already exists, it will be overwritten
func (manager *Manager) SetTask(name string, task ShutdownTask) {
	manager.tasks[name] = task
}
