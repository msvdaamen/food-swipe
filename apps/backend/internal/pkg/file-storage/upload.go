package filestorage

import (
	"context"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

type UploadOptions struct {
	Key      *string
	IsPublic *bool
}

func (a *Adapter) Upload(ctx context.Context, reader io.Reader, options UploadOptions) (*string, error) {
	key := uuid.New().String()
	if options.Key != nil {
		key = *options.Key
	}
	isPublic := options.IsPublic != nil && *options.IsPublic

	_, err := a.Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(a.GetBucket(isPublic)),
		Key:    aws.String(key),
		Body:   reader,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to put object: %w", err)
	}

	return &key, nil
}
