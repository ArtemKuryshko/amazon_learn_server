import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ReviewDTO } from 'src/review/dto/review.dto'
import { ReviewService } from './review.service'

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll() {
    return this.reviewService.getAll()
  }

  @UsePipes(new ValidationPipe())
  @Get('average/:productId')
  async getAverageValueByProductId(@Param('productId') productId: string) {
    return this.reviewService.getAverageValueByProductId(+productId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('leave/:productId')
  @Auth()
  async createReview(
    @CurrentUser('id') id: number,
    @Body() dto: ReviewDTO,
    @Param('productId') productId: string
  ) {
    return this.reviewService.createReview(id, dto, +productId)
  }
}
