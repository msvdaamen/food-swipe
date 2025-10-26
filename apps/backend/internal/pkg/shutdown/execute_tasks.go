package shutdown

import (
	"errors"
	"fmt"
)

type taskError struct {
	name string
	err  error
}

func (e taskError) Error() string {
	return fmt.Errorf("%s: %w", e.name, e.err).Error()
}

// executeTasks executes all shutdown tasks
// All tasks are guaranteed to be executed, even if one or more fail
func (manager *Manager) executeTasks() []taskError {
	taskErrors := make([]taskError, 0, len(manager.tasks))

	for name, task := range manager.tasks {
		defer delete(manager.tasks, name)

		err := task()
		if err != nil {
			taskErrors = append(taskErrors, taskError{
				name: name,
				err:  err,
			})
		}

	}

	return taskErrors
}

func taskErrorsToError(taskErrors []taskError) error {
	var errs []error

	for _, taskError := range taskErrors {
		errs = append(errs, taskError)
	}

	return errors.Join(errs...)

}
