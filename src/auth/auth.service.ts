import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpInterface } from './interfaces';
import { Tokens } from './types';
import { hashData } from 'src/common/utils';
import { Role } from './enums';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signUp({
    email,
    password,
    firstName,
    lastName,
  }: SignUpInterface): Promise<Tokens> {
    // Hash the password
    const hashedPass = await hashData(password);

    // Check email
    if (await this.prismaService.user.findUnique({ where: { email } }))
      throw new BadRequestException('Email is already taken.');

    // Create the user
    const newUser = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPass,
      },
    });

    // Generate JWT tokens
    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.roles as Role[],
    );

    // Update refresh token
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  private async getTokens(
    userId: number,
    email: string,
    roles: Role[],
  ): Promise<Tokens> {
    return {
      access_token: await this.jwtService.sign(
        { userId, email, roles },
        {
          secret: this.configService.get('jwt.access.secret'),
          expiresIn: this.configService.get('jwt.access.exp'),
        },
      ),
      refresh_token: await this.jwtService.sign(
        { userId, email, roles },
        {
          secret: this.configService.get('jwt.refresh.secret'),
          expiresIn: this.configService.get('jwt.refresh.exp'),
        },
      ),
    };
  }

  private async updateRtHash(id: number, rt: string) {
    await this.prismaService.user.update({
      where: { id },
      data: { hashedRt: await hashData(rt) },
    });
  }
}
