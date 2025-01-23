import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ReviewDTO } from 'src/review/dto/review.dto'
import { returnReviewObject } from 'src/review/objects/returnreview.object'

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService) {}

	
	async getAll() {

		const reviews = await this.prisma.review.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			select: returnReviewObject
		})

		return reviews
	}

	async createReview(userId: number, dto: ReviewDTO, productId: number) {
		
		const product = await this.prisma.product.findUnique({where: {
			id: productId
		}})

		if (!product)
			throw new NotFoundException('Product does not exist') 

		const newReview = this.prisma.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: productId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
		
		return newReview
	}

	async getAverageValueByProductId(productId: number) {
		const averageReview = this.prisma.review.aggregate({
			where: { productId },
			_avg: { rating: true }
		}).then(data => data._avg) 

		return averageReview
	}
}
