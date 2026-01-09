package filestorage

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type DeleteOptions struct {
	IsPublic *bool
}

func (a *Adapter) Delete(ctx context.Context, key string, options DeleteOptions) error {
	isPublic := options.IsPublic != nil && *options.IsPublic

	_, err := a.Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(a.GetBucket(isPublic)),
		Key:    aws.String(key),
	})

	return err
}
