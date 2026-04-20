import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUUID, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  guestEmail: string;

  @ApiProperty({ example: '+35799123456' })
  @IsString()
  @IsNotEmpty()
  guestPhone: string;

  @ApiProperty({ example: 'I am interested in Math lessons.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'uuid-of-service', required: false })
  @IsUUID()
  @IsOptional()
  serviceId?: string;

  @ApiProperty({ example: 'uuid-of-user', required: false })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
