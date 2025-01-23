import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/objects/returnCategory.object'
import { returnReviewObject } from 'src/review/objects/returnreview.object'

export const returnProductObject: Prisma.ProductSelect = {
	images: true,
	description: true,
	id: true,
	name: true,
	price: true,
	createdAt: true,
	slug: true,
	category: {
		select: returnCategoryObject
	},
	reviews: {
		select: returnReviewObject
	}
}