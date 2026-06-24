import {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '../../utils/errors';

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const err = new AppError('Something went wrong', 500);
    expect(err.message).toBe('Something went wrong');
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(true);
    expect(err).toBeInstanceOf(Error);
  });
});

describe('NotFoundError', () => {
  it("should default to 'Resource not found'", () => {
    const err = new NotFoundError();
    expect(err.message).toBe('Resource not found');
    expect(err.statusCode).toBe(404);
  });

  it('should use the provided resource name', () => {
    const err = new NotFoundError('User');
    expect(err.message).toBe('User not found');
  });
});

describe('BadRequestError', () => {
  it('should have status 400 with given message', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Invalid input');
  });
});

describe('UnauthorizedError', () => {
  it('should have status 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });
});

describe('ForbiddenError', () => {
  it('should have status 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
  });
});

describe('ConflictError', () => {
  it('should have status 409', () => {
    const err = new ConflictError();
    expect(err.statusCode).toBe(409);
  });
});
