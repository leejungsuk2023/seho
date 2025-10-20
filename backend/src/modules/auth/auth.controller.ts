import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Auth Controller
 * - 인증 관련 API 엔드포인트
 * - PRD.md 5.1 Auth API 구현
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 회원가입
   * POST /api/auth/register
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * 로그인
   * POST /api/auth/login
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 내 정보 조회
   * GET /api/auth/me
   * 
   * TODO: JwtAuthGuard 구현 후 활성화
   */
  // @UseGuards(JwtAuthGuard)
  // @Get('me')
  // async getMe(@Request() req) {
  //   return this.authService.getMe(req.user.id);
  // }
}

