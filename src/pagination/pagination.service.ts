import { Injectable } from '@nestjs/common'
import { PaginationDTO } from './dto/pagination.dto'

@Injectable()
export class PaginationService {
	getPagination(dto: PaginationDTO, defaultPerPage = 30) {
		const page = dto.page ? +dto.page : 1
		const perPage = dto.perPage ? +dto.perPage : defaultPerPage

		const skip = (page - 1) * perPage

		return { perPage, skip }
	}
}
 