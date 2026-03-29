import { IsString, IsOptional, IsUrl, IsUUID, IsArray, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInstituteProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => !!o.website)
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logoUrl?: string;
}

export class AddInquiryNoteDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsUUID()
  authorId: string;
}

export class BulkUpdateServicesDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  serviceIds: string[];
}
export class UpdateBranchDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  cityId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  longitude?: number;
}
