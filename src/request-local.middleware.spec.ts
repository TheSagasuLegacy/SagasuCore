import { RequestLocalMiddleware } from './request-local.middleware';

describe('RequestLocalMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestLocalMiddleware()).toBeDefined();
  });
});
