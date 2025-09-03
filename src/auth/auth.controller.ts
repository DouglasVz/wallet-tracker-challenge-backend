import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user.' })
    @ApiResponse({ 
		status: 200, 
		description: 'User registered successfully.', 
		schema: {
			type: 'Object',
			example: {
				message: "User registered successfully."
			}
		} 
	})
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

    @Post('login')
    @ApiResponse({ 
		status: 200, 
		description: 'Credentials verifications and access token generation.', 
		schema: {
			type: 'Object',
			example: {
				access_token: "string",
				exp: "number"
			}
		} 
	})
    @ApiOperation({ summary: 'Login and receive JWT token' })
	async login(@Body() dto: LoginDto) {
	    return this.authService.login(dto);
	}
}
