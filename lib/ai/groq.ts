import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://api.groq.ai/v1/graphql',
    cache: new InMemoryCache(),
});

export default client;