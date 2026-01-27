package grpc

import "net/http"

type Server interface {
	Handle(pattern string, handler http.Handler)
}
