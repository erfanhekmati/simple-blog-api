import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CurrentUser } from 'src/auth/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiOperation({ summary: 'Creates a blog' })
  @ApiBearerAuth()
  @Post()
  create(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.blogsService.create(userId, createBlogDto);
  }

  @ApiOperation({ summary: 'Finds all blogs' })
  @ApiBearerAuth()
  @Get()
  findAll(@CurrentUser('userId') userId: number) {
    return this.blogsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Finds the blog by id' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.blogsService.findOne(userId, id);
  }

  @ApiOperation({ summary: 'Updates the blog by id' })
  @ApiBearerAuth()
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.blogsService.update(userId, id, updateBlogDto);
  }

  @ApiOperation({ summary: 'Removes the blog by id' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.blogsService.remove(userId, id);
  }
}
