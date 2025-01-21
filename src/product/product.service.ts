import { faker } from '@faker-js/faker'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { EnumProductSort, GetAllProductsDTO } from './dto/getAll.product.dto'
import { ProductDTO } from './dto/product.dto'
import { returnProductObject } from './objects/returnProduct.object'

@Injectable()
export class ProductService {

	constructor(private readonly prisma: PrismaService, private readonly paginationService: PaginationService ) {}
	
	async getAll(dto: GetAllProductsDTO = {}) {

		const {sort, searchTerm} = dto

		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

		if (sort === EnumProductSort.LOW_PRICE) {
			prismaSort.push({price: 'asc'})
		}

		else if (sort === EnumProductSort.HIGH_PRICE) {
			prismaSort.push({price: 'desc'}) 
		}

		else if (sort === EnumProductSort.OLDEST) { 
			prismaSort.push({createdAt: 'asc'}) 
		}
		
		else if (sort === EnumProductSort.NEWEST) { 
			prismaSort.push({createdAt: 'desc'}) 
		}

		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		} : {}

		const {perPage, skip} = this.paginationService.getPagination(dto)
	
		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
			select: returnProductObject
		})
		
		const productsLength = await this.prisma.product.count({
			where: prismaSearchTermFilter
		})

		return {products, length: productsLength }
	}

	async getById(id: number) {

		const product = await this.prisma.product.findUnique({where: {
			id
		},
		select: returnProductObject
		})

		if (!product) 
			throw new NotFoundException('Product not found')

		return product
	}

	async getBySlug(slug: string) {

		const product = await this.prisma.product.findUnique({where: {
			slug
		},
		select: returnProductObject
		})

		if (!product) 
			throw new NotFoundException('Product not found')

		return product
	}

	async getByCategory(categorySlug: string) {

		const products = await this.prisma.product.findMany({where: {
			category: {
				slug: categorySlug
			}
		},
		select: returnProductObject
		})

		if (!products) 
			throw new NotFoundException('Product not found')

		return products
	}

	async getSimilar(id: number) {

		const currentProduct = await this.getById(id)

		if (!currentProduct) 
			throw new NotFoundException('Current product not found')

		const products = await this.prisma.product.findMany({where: {
			category: {
				name: currentProduct.category.name
			},
			NOT: {
				id: currentProduct.id
			}
		},
		orderBy: {
			createdAt: 'desc'
		},
		select: returnProductObject
		})

		return products
	}

	async createProduct() {
		const newProduct = await this.prisma.product.create({
			data: {
				name: '',
				description: '',
				price: 0,
				slug: ''
			}
		})

		return newProduct.id
	}

	async updateProduct(id: number, dto: ProductDTO) {

		const { description, images, price, name, categoryId } = dto

		const category = await this.prisma.category.findUnique({where: {
			id: categoryId
		}})

		if (!category) 
			throw new NotFoundException('Category not found')

		const updatedProduct = this.prisma.product.update({
			where: {
				id
			},
			data: {
				name,
				description,
				price,
				images,
				slug: faker.helpers.slugify(name).toLowerCase(),
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})
		
		return updatedProduct
	}

	async removeProduct(id: number) {

		const deletedProduct = this.prisma.product.delete({
			where: {
				id
			}
		})

		return deletedProduct
	}
}
