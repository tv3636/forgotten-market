import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";

const client = new ApolloClient({
  defaultOptions: { query: { errorPolicy: "all" } },
  cache: new InMemoryCache(),
  link: from([
    onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        try {
          for (let err of graphQLErrors) {
            console.warn(`Checking if to retry GraphQL error: ${err.message}`);

            if (
              err.message ===
              "panic processing query: Once instance has previously been poisoned"
            ) {
              console.info("Retrying panic error...");
              return forward(operation);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      // To retry on network errors, we depend on the RetryLink
      // instead of the onError link. This just logs the error.
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    new RetryLink(),
    new HttpLink({ uri: process.env.SUBGRAPH_ENDPOINT as string }),
  ]),
});

export default client;
