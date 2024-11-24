import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
