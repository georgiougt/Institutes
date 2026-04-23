import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, IsUUID, MinLength, Matches } from 'class-validator';

export class OnboardInstituteDto {
  // Owner info (Only needed for new registrations)
  @ApiProperty({ example: 'owner@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Ο κωδικός είναι πολύ αδύναμος (χρειάζεται κεφαλαία, πεζά, αριθμούς)',
  })
  password?: string;

  @ApiProperty({ example: 'Γιώργος' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Παπαδόπουλος' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'uuid-of-existing-owner' })
  @IsString()
  @IsOptional()
  ownerId?: string;

  // Institute info
  @ApiProperty({ example: 'Φροντιστήριο Η Γνώση' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Το όνομα του φροντιστηρίου είναι πολύ μικρό' })
  instituteName: string;

  @ApiProperty({ example: 'Εξειδικευμένο κέντρο μαθημάτων στην Κύπρο.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://ignosi.cy' })
  @IsString()
  @IsOptional()
  website?: string;

  // Branch info (at least one)
  @ApiProperty({ example: 'Λεωφόρος Αμαθούντος 123' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '25123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, { message: 'Το τηλέφωνο πρέπει να είναι 8 ψηφία' })
  phone: string;

  @ApiProperty({ example: 'uuid-of-city' })
  @IsUUID()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty({ example: 35.1264 })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 33.3677 })
  @IsOptional()
  longitude?: number;

  // Subjects
  @ApiProperty({ example: ['uuid-of-math', 'uuid-of-physics'], type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  serviceIds: string[];
}
