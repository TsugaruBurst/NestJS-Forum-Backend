import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @ApiInternalServerErrorResponse()
    @ApiForbiddenResponse()
    @ApiOkResponse({ type: String, description: "Returns json web token" })
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<string> {
        return await this.authService.login(loginUserDto);
    }

    @HttpCode(HttpStatus.CREATED)
    @ApiInternalServerErrorResponse()
    @ApiCreatedResponse({ type: String, description: "Returns json web token" })
    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto): Promise<string> {
        return await this.authService.register(registerUserDto);
    }
}
