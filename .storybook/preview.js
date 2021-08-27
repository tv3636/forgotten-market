// import { withNextRouter } from "storybook-addon-next-router";
import { RouterContext } from "next/dist/next-server/lib/router-context";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  nextRouter: {
    Provider: RouterContext.Provider
  }
};

// export const decorators = [withNextRouter()];
