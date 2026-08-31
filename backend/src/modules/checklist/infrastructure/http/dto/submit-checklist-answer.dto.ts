import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { AnswerValue } from '../../../domain/entities/checklist-answer.entity.js';

export class SubmitChecklistAnswerDto {
  @ApiProperty()
  @IsUUID()
  itemDefinitionId!: string;

  @ApiProperty({ enum: AnswerValue })
  @IsEnum(AnswerValue)
  answer!: AnswerValue;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
