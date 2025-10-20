import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../database/prisma.service';

/**
 * Users Module
 * - 사용자 관련 기능 모듈
 */
@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}

