import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { UserDTO } from './dto/user.dto'
import { returnUserObject } from './objects/returnUser.object'

@Injectable()
export class UserService {

	constructor(private prisma: PrismaService) {}

	async getById(id: number, selectObject: Prisma.UserSelect = {}) {

		const user = await this.prisma.user.findUnique({where: {
			id
		},
		select: {
			...returnUserObject,
			favorites: {
				select: {
					id: true,
					name: true,
					price: true,
					images: true,
					slug: true
				}
			},
			...selectObject
		}
		})

		if (!user) 
			throw new BadRequestException('User not found')

		return user
	}

	async updateProfile(id: number, dto: UserDTO) {
		
		const isTheSameUser = await this.prisma.user.findUnique({
			where: {email: dto.email}
		})

		if (isTheSameUser && id !== isTheSameUser.id)
			throw new BadRequestException('Email already in use')

		const user = await this.getById(id)

		const updatedUser = this.prisma.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				phone: dto.phone,
				password: dto.password ? await hash(dto.password) : user.password
			}
		})
		
		return updatedUser
	}

	async toggleFavorite(id: number, productId: number) {
		const user = await this.getById(id)

		if (!user)
			throw new NotFoundException('User not found!')

		const isProductExists = user.favorites.some(product => product.id === productId)
		
		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				favorites: {
					[isProductExists ? 'disconnect' : 'connect']: {
						id: productId
					}
				}
			}
		})

		return { message: 'Success' }
	}
}
