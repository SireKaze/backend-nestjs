import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UpdatedBy = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Mengembalikan informasi pengguna dari request
  },
);