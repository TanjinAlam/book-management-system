import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    // check if page and limit are valid
    if (isNaN(page) || page < 0 || isNaN(limit) || limit < 0) {
      throw new BadRequestException('Invalid pagination params');
    }
    // do not allow to fetch large slices of the dataset
    if (limit > 100) {
      throw new BadRequestException(
        'Invalid pagination params: Max limit is 100',
      );
    }

    // calculate pagination parameters
    const size = limit;
    const offset = page * limit;
    return { page, limit, size, offset };
  },
);

export function hasNext(count: number, pagination: Pagination): boolean {
  return count > (pagination.page + 1) * pagination.limit;
}

export function getPaginateData<T>(
  data: T[],
  count: number,
  pagination: Pagination,
) {
  return {
    item: data,
    total: count,
    page: pagination.page,
    limit: pagination.limit,
    hasNextPage: hasNext(count, pagination),
  };
}
