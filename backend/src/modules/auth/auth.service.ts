import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

/**
 * Auth Service
 * - 인증 관련 비즈니스 로직 처리
 * - JWT 토큰 생성 및 검증
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * 회원가입
   * PRD.md 5.1 - POST /api/auth/register
   */
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    // JWT 토큰 생성
    const token = this.generateToken(user);

    // 비밀번호 해시 제거 후 반환
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    };
  }

  /**
   * 로그인
   * PRD.md 5.1 - POST /api/auth/login
   */
  async login(loginDto: LoginDto) {
    // 사용자 찾기
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 이메일 인증 확인 (선택사항 - MVP에서는 스킵 가능)
    // if (!user.isVerified) {
    //   throw new UnauthorizedException('이메일 인증이 필요합니다.');
    // }

    // JWT 토큰 생성
    const token = this.generateToken(user);

    // 비밀번호 해시 제거 후 반환
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    };
  }

  /**
   * JWT 토큰 생성
   */
  generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * JWT 토큰 검증
   */
  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  /**
   * 사용자 ID로 현재 사용자 정보 조회
   */
  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      success: true,
      data: userWithoutPassword,
    };
  }
}

