import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class WriteCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(600)
  content: string;
}
