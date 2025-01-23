import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GetAllProductsDTO } from './dto/getAll.product.dto'
import { ProductDTO } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDTO: GetAllProductsDTO) {
    return this.productService.getAll(queryDTO)
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productService.getById(+id)
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(+id)
  }

  @Get('by-slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.getBySlug(slug)
  }

  @Get('by-category/:categorySlug')
  async getProductByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.getByCategory(categorySlug)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createProduct() {
    return this.productService.createProduct()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductDTO) {
    return this.productService.updateProduct(+id, dto)
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async removeProduct(@Param('id') id: string) {
    return this.productService.removeProduct(+id)
  }
}
