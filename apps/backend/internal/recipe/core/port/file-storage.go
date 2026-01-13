package port

import (
	"context"
	"io"

	filestorage "github.com/food-swipe/internal/pkg/file-storage"
)

type FileStorage interface {
	Delete(ctx context.Context, key string, options filestorage.DeleteOptions) error
	Upload(ctx context.Context, reader io.Reader, options filestorage.UploadOptions) (*string, error)
	PublicURL(key string) string
}
