import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * 로그인 DTO
 * PRD.md 5.1 - POST /api/auth/login
 */
export class LoginDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}

