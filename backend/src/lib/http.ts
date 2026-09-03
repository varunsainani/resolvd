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

// 400 Bad Request: the client sent something we cannot accept.
export function badRequest(key = "invalid_input"): ApiError {
  return new ApiError(400, key);
}

// 401 Unauthorized: the request is missing or has invalid credentials.
export function unauthorized(key = "not_authenticated"): ApiError {
  return new ApiError(401, key);
}

// 403 Forbidden: authenticated, but not allowed to perform this action.
export function forbidden(key = "forbidden"): ApiError {
  return new ApiError(403, key);
}

// 404 Not Found: the addressed resource does not exist.
export function notFound(key = "not_found"): ApiError {
  return new ApiError(404, key);
}
