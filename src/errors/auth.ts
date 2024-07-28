import SaleorError from './SaleorError';

export class AuthInvalidCredentialsError extends SaleorError {}
export class AuthNotYetCompleteSurveyError extends SaleorError {}
export class AuthForgotPasswordError extends SaleorError {}
export class AuthResetPasswordError extends SaleorError {}
export class AuthChangePasswordError extends SaleorError {}
