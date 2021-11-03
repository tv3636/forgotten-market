import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    new RetryLink(),
    new HttpLink({ uri: process.env.SUBGRAPH_ENDPOINT as string }),
  ]),
});

export default client;
