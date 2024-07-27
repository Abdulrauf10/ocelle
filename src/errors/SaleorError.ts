type ErrorBody<T> = { field?: string | null; code: T; message?: string | null };

export default class SaleorError<T = string> extends Error {
  errors?: ErrorBody<T>[];
  constructor(errors?: ErrorBody<T>[]) {
    super(JSON.stringify(errors));
    this.errors = errors;
  }
}
