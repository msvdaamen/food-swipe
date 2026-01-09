package main

import (
	"net/http"

	"connectrpc.com/grpcreflect"
)

func setupGrpcServer(port string) (*http.ServeMux, *http.Server) {
	mux := http.NewServeMux()
	reflector := grpcreflect.NewStaticReflector(
		"followers.v1.FollowerService",
		"user.v1.UserService",
	)
	mux.Handle(grpcreflect.NewHandlerV1(reflector))
	mux.Handle(grpcreflect.NewHandlerV1Alpha(reflector))
	p := new(http.Protocols)
	p.SetHTTP1(true)
	p.SetUnencryptedHTTP2(true)
	server := &http.Server{
		Addr:      "localhost:" + port,
		Handler:   mux,
		Protocols: p,
	}
	return mux, server
}
