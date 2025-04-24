/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "food-swipe",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile:
            input?.stage === "production"
              ? "food-swipe-prod"
              : "food-swipe-dev",
        },
      },
    };
  },
  async run() {},
});
