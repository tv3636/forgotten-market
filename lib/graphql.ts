import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/6917/frwc-lore/v0.1.2",
  cache: new InMemoryCache(),
});

export default client;
