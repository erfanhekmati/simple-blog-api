import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma.service';
import { WriteCommentDto } from './dto';
import { AuthService } from 'src/auth/auth.service';
import { EmailsService } from 'src/emails/emails.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentAddedEvent } from './events';

@Injectable()
export class BlogsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async writeComment(
    authorId: number,
    blogId: number,
    { content }: WriteCommentDto,
  ) {
    const authorEmail = await this.authService.getUserEmailById(authorId);
    const comment = await this.prismaService.comment.create({
      data: {
        content,
        authorEmail,
        blogId,
      },
    });

    await this.eventEmitter.emit(
      'comment.added',
      new CommentAddedEvent(authorId, authorEmail, blogId),
    );

    const { id, createdAt } = comment;
    return { id, content, createdAt, authorEmail };
  }

  public create(
    authorId: number,
    { title, description, article, tags }: CreateBlogDto,
  ) {
    return this.prismaService.blog.create({
      data: { title, description, article, tags, authorId },
    });
  }

  public async findAll(
    page: number = 1,
    pageSize: number = 10,
    authorId?: number,
  ) {
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 30) {
      pageSize = 10;
    }

    const skip = (page - 1) * pageSize;
    if (authorId)
      return (
        await this.prismaService.blog.findMany({
          take: pageSize,
          skip: skip,
          where: { authorId },
          include: { comments: true },
        })
      ).map(
        ({
          id,
          title,
          description,
          tags,
          createdAt,
          updatedAt,
          viewCount,
          comments,
        }) => {
          return {
            id,
            title,
            description,
            tags,
            createdAt,
            updatedAt,
            viewCount,
            commentsCount: comments.length,
          };
        },
      );
    return (
      await this.prismaService.blog.findMany({
        take: pageSize,
        skip: skip,
        include: {
          author: { select: { firstName: true, lastName: true } },
          comments: true,
        },
      })
    ).map(
      ({
        id,
        title,
        description,
        tags,
        createdAt,
        viewCount,
        author,
        comments,
      }) => {
        return {
          id,
          title,
          description,
          tags,
          createdAt,
          viewCount,
          author,
          commentsCount: comments.length,
        };
      },
    );
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

  public async view(id: number) {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
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

    // Increment view count
    await this.updateViewCount(id, blog.viewCount + 1);

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
      viewCount: viewCount + 1,
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

  private async updateViewCount(id: number, viewCount: number) {
    await this.prismaService.blog.update({
      where: { id },
      data: { viewCount },
    });
  }
}
