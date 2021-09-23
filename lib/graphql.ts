import { ApolloClient, InMemoryCache } from "@apollo/client";

console.log(`Graphski: ${process.env.SUBGRAPH_ENDPOINT}`);
const client = new ApolloClient({
  uri: process.env.SUBGRAPH_ENDPOINT,
  cache: new InMemoryCache(),
});

export default client;
