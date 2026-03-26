import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardingSignupDto {
  @ApiProperty() @IsEmail() @IsNotEmpty() email: string;
  @ApiProperty() @IsString() @IsNotEmpty() password: string;
  @ApiProperty() @IsString() @IsOptional() firstName?: string;
  @ApiProperty() @IsString() @IsOptional() lastName?: string;
}

export class UpdateDraftDto {
  @ApiProperty() @IsString() @IsNotEmpty() userId: string;
  @ApiProperty() @IsString() @IsOptional() instituteId?: string; // If null, creates new draft
  @ApiProperty() @IsInt() @Min(1) @Max(7) step: number;
  
  // Dynamic fields based on step
  @ApiProperty() @IsString() @IsOptional() name?: string;
  @ApiProperty() @IsString() @IsOptional() description?: string;
  @ApiProperty() @IsString() @IsOptional() website?: string;
  
  @ApiProperty() @IsString() @IsOptional() address?: string;
  @ApiProperty() @IsString() @IsOptional() cityId?: string;
  @ApiProperty() @IsString() @IsOptional() phone?: string;
  
  @ApiProperty() @IsArray() @IsString({ each: true }) @IsOptional() serviceIds?: string[];
  
  @ApiProperty() @IsString() @IsOptional() logoUrl?: string;
  @ApiProperty() @IsString() @IsOptional() coverUrl?: string;
}

export class ClaimSubmitDto {
  @ApiProperty() @IsString() @IsNotEmpty() instituteId: string;
  @ApiProperty() @IsString() @IsNotEmpty() claimantId: string;
  @ApiProperty() @IsEmail() @IsNotEmpty() email: string;
  @ApiProperty() @IsString() @IsOptional() phone?: string;
  @ApiProperty() @IsString() @IsOptional() message?: string;
  @ApiProperty() @IsString() @IsOptional() proofUrl?: string;
}

export class SearchClaimsDto {
  @ApiProperty() @IsString() @IsNotEmpty() query: string;
}
