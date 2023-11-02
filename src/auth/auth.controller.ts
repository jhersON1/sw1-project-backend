import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginUserDto } from "./dto";
import { Auth, GetUser } from "./decorators";
import { ValidRoles } from "./interfaces";
import { User } from "./entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateRoute(@GetUser() user: User) {
    return {
      ok: true,
      user,
    }
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }
}
