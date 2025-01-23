import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class StatisticsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService
	) {}

	async getMain(userId: number) {
		const user = await this.userService.getById(userId, {
			orders: {
				select: {
					items: true
				}
			},
			reviews: true
		})

		const allOrders = await this.prisma.order.findMany({
			where: {
				userId
			},
			select: {
				items: {
					select: {
						price: true
					}
				}
			}
		})
		
		const totalAmount = allOrders.forEach(order => order.items.reduce((acc, current) => acc + current.price, 0))
	
		return {totalAmount}

	}
}
