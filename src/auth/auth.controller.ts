import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos';
import { CurrentUser, Public } from './decorators';
import { JwtRefreshAuthGuard } from './guards';
import { Tokens } from './types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Finds current user' })
  @ApiBearerAuth()
  @Get('me')
  findMe(@CurrentUser('userId') userId: number) {
    return this.authService.findMe(userId);
  }

  @Public()
  @ApiOperation({ summary: 'Signs Up a user' })
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Public()
  @ApiOperation({ summary: 'Signs in a user' })
  @Post('signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Public()
  @ApiOperation({ summary: 'Refresh tokens' })
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth()
  @Post('refresh-tokens')
  refreshToken(
    @CurrentUser('userId') userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiOperation({ summary: 'Signs out the signed in user' })
  @ApiBearerAuth()
  @Post('signout')
  signOut(@CurrentUser('userId') userId: number) {
    return this.authService.signOut(userId);
  }
}
