import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { useAuth } from '../context/AuthContext';

const hostname = window.location.hostname;
const subdomain = hostname.split('.')[0];
const API_URL = import.meta.env.VITE_VENDURE_SERVER_URL;
// If using bearer-token based session management, we'll store the token
// in localStorage using this key.

let languageCode: string | undefined;

/**
 * Used to specify a language for any localized results.
 */
function setLanguageCode(value: string | undefined) {
  languageCode = value;
}

const useApolloClient = () => {
  const { authToken, setAuthToken } = useAuth();

  const httpLink = createUploadLink({
    uri: () => {
      if (languageCode) {
        return `${API_URL}?languageCode=${languageCode}`;
      } else {
        return API_URL;
      }
    },
    // This is required if using cookie-based session management,
    // so that any cookies get sent with the request.
    credentials: 'include',
  });

  // This part is used to check for and store the session token
  // if it is returned by the server.
  const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext();
      const authHeader = context.response.headers.get('vendure-auth-token');
      if (authHeader) {
        // If the auth token has been returned by the Vendure
        // server, we store it in AuthContext
        setAuthToken(authHeader);
      }
      return response;
    });
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      // If we have stored the authToken from a previous
      // response, we attach it to all subsequent requests.
      setContext((request, operation) => {
        let channelToken = '8dda0c24-c422-4cca-bbe2-53375856c0d7'; //urbana store token
        if (subdomain === 'demo') {
          channelToken = '8d8f0da4-d470-41fc-897c-7604c139f8cb'; //sample store token
        }
        //const channelToken = '';
        let headers: Record<string, any> = {};
        if (authToken) {
          headers.authorization = `Bearer ${authToken}`;
        }
        if (channelToken) {
          headers['vendure-token'] = channelToken;
        }
        return { headers };
      }),
      afterwareLink,
      httpLink,
    ]),
    // cache: new InMemoryCache(),
    cache: new InMemoryCache({
      typePolicies: {
        Product: {
          fields: {
            assets: {
              merge(existing = [], incoming: any[]) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
  return client;
};

export default useApolloClient;
