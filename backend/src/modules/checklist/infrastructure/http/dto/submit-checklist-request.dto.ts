import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsString, ValidateNested } from 'class-validator';
import { SubmitChecklistAnswerDto } from './submit-checklist-answer.dto.js';

export class SubmitChecklistRequestDto {
  @ApiProperty()
  @IsString()
  vehiclePlate!: string;

  @ApiProperty()
  @IsString()
  driverName!: string;

  @ApiProperty()
  @IsString()
  driverCnh!: string;

  @ApiProperty()
  @IsString()
  unNumber!: string;

  @ApiProperty({ type: [SubmitChecklistAnswerDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitChecklistAnswerDto)
  answers!: SubmitChecklistAnswerDto[];
}
