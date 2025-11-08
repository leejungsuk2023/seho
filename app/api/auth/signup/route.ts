import * as bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const signUpSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .regex(/[A-Za-z]/, { message: "비밀번호에는 영문이 포함되어야 합니다." })
    .regex(/\d/, { message: "비밀번호에는 숫자가 포함되어야 합니다." }),
  nickname: z
    .string()
    .min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." })
    .max(20, { message: "닉네임은 최대 20자까지 가능합니다." }),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  const parsed = signUpSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "입력 값을 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { email, password, nickname } = parsed.data

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
    select: {
      email: true,
      nickname: true,
    },
  })

  if (existingUser) {
    return NextResponse.json(
      {
        message: "이미 가입된 사용자입니다.",
        details:
          existingUser.email === email
            ? "이메일이 이미 사용 중입니다."
            : "닉네임이 이미 사용 중입니다.",
      },
      { status: 409 },
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      nickname,
    },
  })

  return NextResponse.json(
    {
      message: "회원가입이 완료되었습니다.",
    },
    { status: 201 },
  )
}
