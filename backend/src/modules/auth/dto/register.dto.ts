import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * 회원가입 DTO
 * PRD.md 5.1 - POST /api/auth/register
 */
export class RegisterDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;
}

