export default class UserNotConfirmedError extends Error {
  constructor() {
    super('user not confirmed');
  }
}
