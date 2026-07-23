export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: any;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    details: any = null,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || getDefaultErrorCode(statusCode);
    this.details = details !== undefined ? details : null;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

function getDefaultErrorCode(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 413:
      return 'PAYLOAD_TOO_LARGE';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    case 429:
      return 'TOO_MANY_REQUESTS';
    case 500:
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', code = 'BAD_REQUEST', details: any = null) {
    super(400, message, code, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access', code = 'UNAUTHORIZED', details: any = null) {
    super(401, message, code, details);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden access', code = 'FORBIDDEN', details: any = null) {
    super(403, message, code, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND', details: any = null) {
    super(404, message, code, details);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR', details: any = null) {
    super(500, message, code, details);
  }
}

