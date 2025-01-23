import { Injectable } from '@nestjs/common'
import { IsString } from 'class-validator'

@Injectable()
export class RefreshTokenDTO {
	
	@IsString()
	refreshToken: string

}