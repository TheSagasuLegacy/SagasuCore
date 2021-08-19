import { UserAuthGuard } from './user-auth.guard';

describe('UserAuthGuard', () => {
  it('should be defined', () => {
    expect(new UserAuthGuard()).toBeDefined();
    //expect(new UserJwtAuthGuard()).toBeDefined();
    expect(new UserAuthGuard()).toBeDefined();
  });
});
