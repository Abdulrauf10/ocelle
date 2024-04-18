export default class StripeNotReadyError extends Error {
  constructor(id: string) {
    super(`stripe is not ready for the user: ${id}`);
  }
}
