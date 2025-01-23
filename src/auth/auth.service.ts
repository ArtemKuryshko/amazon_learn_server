import { faker } from '@faker-js/faker'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthDTO } from './dto/auth.dto'
import { RefreshTokenDTO } from './dto/refresh-token.dto'

@Injectable()
export class AuthService {
	
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	async register(dto: AuthDTO) {
		const oldUser = await this.getByEmail(dto.email)

		if (oldUser) throw new NotFoundException('User was not found')

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: faker.name.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number('+38 (###) ###-##-##'),
				password: await hash(dto.password)
			}
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async login(dto: AuthDTO) {
		const user = await this.validateUser(dto)

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens(dto: RefreshTokenDTO) {
		const result = await this.jwt.verifyAsync(dto.refreshToken)

		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.prisma.user.findUnique({ where: {
			id: result.id
		}})

		const tokens = await this.issueTokens(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	private async issueTokens (userId: number) {
		const data = {
			id: userId
		}

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDTO) {

		const user = await this.getByEmail(dto.email)

		if (!user) throw new NotFoundException('User was not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}

	private getByEmail(email: string) {
		const user = this.prisma.user.findUnique({
			where: {
				email
			}
		})

		return user
	}
}
