import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {

    constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto):Promise<{ message: string }> {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) throw new BadRequestException('Email already in use');

        const password = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
			email: dto.email,
			password,
		});

        await this.userRepo.save(user);

		return { message: 'User registered successfully' };
    }

    async login(dto: LoginDto): Promise<{ access_token: string, exp: number }> {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(dto.password, user.password);
		if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const expiresIn = 60 * 60; // 1 hour in seconds
        const payload = { sub: user.id, email: user.email };
		const token = this.jwtService.sign(payload, { expiresIn });

		const exp = Math.floor(Date.now() / 1000) + expiresIn;

        return {access_token: token, exp}
    }
}
