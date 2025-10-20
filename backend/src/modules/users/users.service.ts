import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

/**
 * Users Service
 * - 사용자 CRUD 작업 처리
 * - 프로필 관리
 */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * 이메일로 사용자 찾기
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * ID로 사용자 찾기
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        userTags: {
          include: {
            tag: true,
          },
        },
        userInterests: {
          include: {
            interest: true,
          },
        },
      },
    });
  }

  /**
   * 닉네임으로 사용자 찾기
   */
  async findByNickname(nickname: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { nickname },
    });
  }

  /**
   * 새 사용자 생성 (이메일 회원가입)
   */
  async create(data: {
    email: string;
    password: string;
    nickname: string;
  }): Promise<User> {
    // 이메일 중복 체크
    const existingEmail = await this.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 닉네임 중복 체크
    const existingNickname = await this.findByNickname(data.nickname);
    if (existingNickname) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 사용자 생성
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        nickname: data.nickname,
      },
    });
  }

  /**
   * 소셜 로그인 사용자 생성 또는 찾기
   */
  async findOrCreateSocialUser(data: {
    email: string;
    provider: 'GOOGLE' | 'KAKAO';
    providerId: string;
    nickname: string;
    profileImageUrl?: string;
  }): Promise<{ user: User; isNew: boolean }> {
    // 기존 사용자 찾기 (provider + providerId)
    let user = await this.prisma.user.findFirst({
      where: {
        provider: data.provider,
        providerId: data.providerId,
      },
    });

    if (user) {
      return { user, isNew: false };
    }

    // 이메일로 기존 사용자 찾기
    user = await this.findByEmail(data.email);
    if (user) {
      // 기존 사용자에 소셜 로그인 연동
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          provider: data.provider,
          providerId: data.providerId,
        },
      });
      return { user, isNew: false };
    }

    // 닉네임 중복 시 자동 수정
    let nickname = data.nickname;
    let counter = 1;
    while (await this.findByNickname(nickname)) {
      nickname = `${data.nickname}${counter}`;
      counter++;
    }

    // 새 사용자 생성
    user = await this.prisma.user.create({
      data: {
        email: data.email,
        nickname,
        provider: data.provider,
        providerId: data.providerId,
        profileImageUrl: data.profileImageUrl,
        isVerified: true, // 소셜 로그인은 자동 인증
      },
    });

    return { user, isNew: true };
  }

  /**
   * 비밀번호 검증
   */
  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) {
      return false;
    }
    return bcrypt.compare(password, user.passwordHash);
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(
    userId: string,
    data: {
      nickname?: string;
      bio?: string;
      profileImageUrl?: string;
    },
  ): Promise<User> {
    // 닉네임 변경 시 중복 체크
    if (data.nickname) {
      const existing = await this.prisma.user.findFirst({
        where: {
          nickname: data.nickname,
          NOT: { id: userId },
        },
      });
      if (existing) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * 이메일 인증 처리
   */
  async verifyEmail(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  /**
   * 비밀번호 변경
   */
  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });
  }
}

