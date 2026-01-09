package filestorage

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Adapter struct {
	PublicUrl       string
	AccessKeyID     string
	SecretAccessKey string
	bucket          string
	Endpoint        string
	Client          *s3.Client
}

func New(config *Config) *Adapter {
	cfg, err := awsConfig.LoadDefaultConfig(context.TODO(),
		awsConfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(config.AccessKeyID, config.SecretAccessKey, "")),
		awsConfig.WithRegion("auto"), // Required by SDK but not used by R2
	)
	if err != nil {
		log.Fatal(err)
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(config.Endpoint)
	})

	return &Adapter{
		PublicUrl:       config.PublicUrl,
		AccessKeyID:     config.AccessKeyID,
		SecretAccessKey: config.SecretAccessKey,
		bucket:          config.Bucket,
		Endpoint:        config.Endpoint,
		Client:          client,
	}
}

func (a *Adapter) GetBucket(isPublic bool) string {
	if isPublic {
		return a.bucket + "-public"
	}
	return a.bucket
}
