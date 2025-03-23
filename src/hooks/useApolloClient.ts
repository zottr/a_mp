import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_VENDURE_SERVER_URL
  ? process.env.REACT_APP_VENDURE_SERVER_URL
  : `https://demo.vendure.io/admin-api`;
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
        // const channelToken = 'Urbana_Haat';
        const channelToken = '';
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
    cache: new InMemoryCache(),
  });
  return client;
};

export default useApolloClient;
