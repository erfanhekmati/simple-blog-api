import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CurrentUser } from 'src/auth/decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBlogDto, UpdateBlogDto, WriteCommentDto } from './dto';

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
  @ApiQuery({ required: false, name: 'page', type: Number })
  @ApiQuery({ required: false, name: 'pageSize', type: Number })
  @Get()
  findAllCurrentUser(
    @CurrentUser('userId') userId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.blogsService.findAll(page, pageSize);
  }

  @ApiOperation({ summary: 'Finds all blogs' })
  @ApiBearerAuth()
  @ApiQuery({ required: false, name: 'page', type: Number })
  @ApiQuery({ required: false, name: 'pageSize', type: Number })
  @Get('all')
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.blogsService.findAll(page, pageSize);
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

  @ApiOperation({ summary: 'Views the blog by id' })
  @ApiBearerAuth()
  @Get(':id/view')
  view(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.view(id);
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

  @ApiOperation({ summary: 'Writes a comment for a blog by id' })
  @ApiBearerAuth()
  @Post(':id/comment')
  writeComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: WriteCommentDto,
    @CurrentUser('userId') userId: number,
  ) {
    return this.blogsService.writeComment(userId, id, body);
  }
}
