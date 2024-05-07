import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private readonly prismaService: PrismaService) {}

  public create(
    authorId: number,
    { title, description, article, tags }: CreateBlogDto,
  ) {
    return this.prismaService.blog.create({
      data: { title, description, article, tags, authorId },
    });
  }

  public async findAll(authorId?: number) {
    if (authorId)
      return this.prismaService.blog.findMany({
        where: { authorId },
        select: {
          id: true,
          title: true,
          description: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          viewCount: true,
        },
      });
    return (
      await this.prismaService.blog.findMany({
        include: { author: { select: { firstName: true, lastName: true } } },
      })
    ).map(({ id, title, description, tags, createdAt, viewCount, author }) => {
      return { id, title, description, tags, createdAt, viewCount, author };
    });
  }

  public async findOne(authorId: number, id: number) {
    const blog = await this.prismaService.blog.findUnique({
      where: { authorId, id },
      include: {
        comments: {
          select: {
            id: true,
            authorEmail: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });
    if (!blog) throw new NotFoundException('Blog not found.');
    const {
      title,
      description,
      article,
      tags,
      createdAt,
      updatedAt,
      viewCount,
      comments,
    } = blog;
    return {
      id,
      title,
      description,
      article,
      tags,
      createdAt,
      updatedAt,
      viewCount,
      comments,
    };
  }

  public async update(
    authorId: number,
    id: number,
    updateBlogDto: UpdateBlogDto,
  ) {
    await this.findOne(authorId, id);
    const blog = await this.prismaService.blog.update({
      where: { authorId, id },
      data: updateBlogDto,
    });
    const {
      title,
      description,
      article,
      tags,
      createdAt,
      updatedAt,
      viewCount,
    } = blog;
    return {
      id,
      title,
      description,
      article,
      tags,
      createdAt,
      updatedAt,
      viewCount,
    };
  }

  public async remove(authorId: number, id: number) {
    await this.findOne(authorId, id);
    const blog = await this.prismaService.blog.delete({
      where: { authorId, id },
    });
    const {
      title,
      description,
      article,
      tags,
      createdAt,
      updatedAt,
      viewCount,
    } = blog;
    return {
      id,
      title,
      description,
      article,
      tags,
      createdAt,
      updatedAt,
      viewCount,
    };
  }
}
