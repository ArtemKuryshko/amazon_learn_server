import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryService } from './category.service'
import { CategoryDTO } from './dto/category.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("by-slug/:slug")
  async getBySlug(@Param('categorySlug') categorySlug: string) {
    return this.categoryService.getBySlug(categorySlug)
  }

  @Get(":id")
  async getById(@Param('id') id: string) {
    return this.categoryService.getById(+id)
  }

  @Get()
  async getAll() {
    return this.categoryService.getAll()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createCategory() {
    return this.categoryService.createCategory()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() dto: CategoryDTO) {
    return this.categoryService.updateCategory(+id, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')  
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.removeCategory(+id)
  }
}
