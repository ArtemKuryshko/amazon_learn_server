import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from 'src/pagination/dto/pagination.dto'

export enum EnumProductSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class GetAllProductsDTO extends PaginationDTO {
	@IsOptional()
	@IsEnum(EnumProductSort)
	sort?: EnumProductSort

	@IsOptional()
	@IsString()
	searchTerm?: string
}