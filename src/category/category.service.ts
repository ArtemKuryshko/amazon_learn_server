import { faker } from '@faker-js/faker'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryDTO } from './dto/category.dto'
import { returnCategoryObject } from './objects/returnCategory.object'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getById(id: number) {

		const category = await this.prisma.category.findUnique({where: {
			id
		},
		select: returnCategoryObject
		})

		if (!category) 
			throw new NotFoundException('Category not found')

		return category
	}

	async getBySlug(slug: string) {

		const category = await this.prisma.category.findUnique({where: {
			slug
		},
		select: returnCategoryObject
		})

		if (!category) 
			throw new NotFoundException('Category not found')

		return category
	}

	async getAll() {

		const categories = await this.prisma.category.findMany({
			select: returnCategoryObject
		})

		return categories
	}

	async createCategory() {
		
		const newCategory = this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})

		return newCategory
	}

	async updateCategory(id: number, dto: CategoryDTO) {

		const updatedCategory = this.prisma.category.update({
			where: {
				id
			},
			data: {
				name: dto.name,
				slug: faker.helpers.slugify(dto.name).toLowerCase()
			}
		})
		
		return updatedCategory
	}	

	async removeCategory(id: number) {

		const deletedCategory = this.prisma.category.delete({
			where: {
				id
			}
		})

		return deletedCategory
	}
}
