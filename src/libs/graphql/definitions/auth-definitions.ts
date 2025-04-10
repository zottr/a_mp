import { gql } from '@apollo/client';

import { ERROR_RESULT_FRAGMENT } from './shared-definitions';

export const CURRENT_USER_FRAGMENT = gql`
  fragment CurrentUser on CurrentUser {
    __typename
    id
    identifier
    channels {
      id
      code
      token
      permissions
    }
  }
`;

export const ATTEMPT_LOGIN = gql`
  mutation AttemptLogin(
    $username: String!
    $password: String!
    $rememberMe: Boolean!
  ) {
    login(username: $username, password: $password, rememberMe: $rememberMe) {
      ...CurrentUser
      ...ErrorResult
    }
  }
  ${CURRENT_USER_FRAGMENT}
  ${ERROR_RESULT_FRAGMENT}
`;

export const LOG_OUT = gql`
  mutation LogOut {
    logout {
      success
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      ...CurrentUser
    }
  }
  ${CURRENT_USER_FRAGMENT}
`;

export const AUTHENTICATE_ADMIN_VIA_OTP = gql`
  mutation AuthenticateAdmin($phoneNumber: String!, $otp: String!) {
    authenticate(
      input: { whatsappOTP: { phoneNumber: $phoneNumber, otp: $otp } }
    ) {
      ...CurrentUser
      ...ErrorResult
    }
  }
  ${CURRENT_USER_FRAGMENT}
  ${ERROR_RESULT_FRAGMENT}
`;
