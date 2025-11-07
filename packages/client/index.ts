export * from "./src/gen/v1/user_pb";

import type { DescService } from "@bufbuild/protobuf";
import { createClient as createClientInternal } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";

const transport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_URL!,
});

export const createClient = <T extends DescService>(service: T) => {
  return createClientInternal(service, transport);
};
