import { createGrpcTransport } from "@connectrpc/connect-node";

export const grpcTransport = createGrpcTransport({
  baseUrl: process.env.GRPC_URL!,
});
