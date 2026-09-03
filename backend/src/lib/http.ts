// A route-level error that carries an HTTP status and an i18n message key.
// The central error handler in app.ts translates the key for the request locale,
// so handlers can `throw badRequest("subject_required")` and stay declarative.
export class ApiError extends Error {
  status: number;
  key: string;

  constructor(status: number, key: string) {
    super(key);
    this.name = "ApiError";
    this.status = status;
    this.key = key;
  }
}
