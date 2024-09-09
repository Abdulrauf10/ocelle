import { headers } from 'next/headers';

import userService from './user';

import {
  AuthChangePasswordError,
  AuthForgotPasswordError,
  AuthInvalidCredentialsError,
  AuthNotYetCompleteSurveyError,
  AuthResetPasswordError,
} from '@/errors/auth';
import { ChangePasswordDocument, RequestPasswordResetDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { getServerAuthClient } from '@/saleorAuthClient';

class AuthService {
  async login(email: string, password: string) {
    const authClient = getServerAuthClient();

    const {
      data: { tokenCreate },
    } = await authClient.signIn({ email, password }, { cache: 'no-store' });

    if (tokenCreate.errors.length > 0) {
      throw new AuthInvalidCredentialsError();
    }

    try {
      const me = await userService.me();
      if (me.dogs.length === 0) {
        // not yet completed any surveys
        throw new AuthNotYetCompleteSurveyError();
      }
    } catch (e) {
      getServerAuthClient().signOut();
      throw e;
    }
  }
  async resetPassword(email: string, password: string, token: string) {
    const authClient = getServerAuthClient();
    const {
      data: { setPassword },
    } = await authClient.resetPassword({ email, password, token });

    if (setPassword.errors) {
      throw new AuthResetPasswordError();
    }
  }
  async forgotPassword(email: string) {
    const headersList = headers();
    const origin = headersList.get('origin');
    const { requestPasswordReset } = await executeGraphQL(RequestPasswordResetDocument, {
      variables: {
        email,
        redirectUrl: `${origin}/auth/reset-password`,
      },
      withAuth: false,
    });

    if (!requestPasswordReset || requestPasswordReset.errors.length > 0) {
      throw new AuthForgotPasswordError(requestPasswordReset?.errors);
    }
  }
  async changePassword(oldPassword: string, newPassword: string) {
    const { passwordChange } = await executeGraphQL(ChangePasswordDocument, {
      variables: {
        oldPassword,
        newPassword,
      },
    });

    if (!passwordChange || passwordChange.errors.length > 0) {
      throw new AuthChangePasswordError(passwordChange?.errors);
    }
  }
}

const authService = new AuthService();

export default authService;
