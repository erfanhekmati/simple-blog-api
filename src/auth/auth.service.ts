import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpInterface } from './interfaces';
import { Tokens } from './types';
import { hashData } from 'src/common/utils';
import { Role } from './enums';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async refreshTokens(id: number, rt: string): Promise<Tokens> {
    // Validate refresh tokens
    const user = await this.validateRefreshTokens(id, rt);

    // Get new tokens
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.roles as Role[],
    );

    // Update refresh token
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  public async signIn(username: string, password: string): Promise<Tokens> {
    // Validate user
    const user = await this.validateUser(username, password);

    if (!user)
      throw new UnauthorizedException('Email or password is incorrect.');

    // Get new tokens
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.roles as Role[],
    );

    // Update refresh token
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

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

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) {
      const passMatches = await bcrypt.compare(password, user.password);
      if (passMatches) return user;
    }
    return null;
  }

  private async validateRefreshTokens(id: number, rt: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new ForbiddenException('Access denied.');

    // Compare refresh tokens
    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access denied.');

    return user;
  }
}
