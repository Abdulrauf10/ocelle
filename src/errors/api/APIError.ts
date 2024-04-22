export default class APIError<T extends { errors: any } | null | undefined> extends Error {
  public errors?: NonNullable<T>['errors'];
  constructor(message: string, mutation: T) {
    super(message);
    this.errors = mutation?.errors;
  }
}
