import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Signs Up a user' })
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @ApiOperation({ summary: 'Signs in a user' })
  @Post('signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body.email, body.password);
  }
}
