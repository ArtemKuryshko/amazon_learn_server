import { Injectable } from '@nestjs/common'
import { IsEmail, IsString, MinLength } from 'class-validator'

@Injectable()
export class AuthDTO {
	@IsEmail()
	email: string
	
	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@IsString()
	password: string
}