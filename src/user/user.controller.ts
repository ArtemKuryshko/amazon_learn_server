import { Body, Controller, Get, HttpCode, Param, Patch, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDTO } from './dto/user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.getById(id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDTO) {
    return this.userService.updateProfile(id, dto)
  }

  @HttpCode(200)
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(@Param('productId') productId: string, @CurrentUser('id') id: number) {
    return this.userService.toggleFavorite(id, +productId)
  }
}
