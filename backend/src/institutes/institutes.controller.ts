import { Controller, Get, Param, Query, Post, Body, UnauthorizedException, InternalServerErrorException, ConflictException, BadRequestException, NotFoundException, Delete } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { SearchInstitutesDto } from './dto/search-institutes.dto';
import { OnboardInstituteDto } from './dto/onboard-institute.dto';
import { LoginDto } from './dto/login.dto';
import { CreateContactRequestDto } from './dto/contact-request.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Institutes')
@Controller('institutes')
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Get()
  @ApiOperation({ summary: 'Search and list institutes' })
  @ApiResponse({ status: 200, description: 'Return list of institutes matching the criteria.' })
  search(@Query() searchDto: SearchInstitutesDto) {
    return this.institutesService.search(searchDto);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get the 3 most recent approved institutes (optionally near location)' })
  @ApiResponse({ status: 200, description: 'Return a small list of newly added or nearby institutes.' })
  getRecent(@Query('lat') lat?: number, @Query('lng') lng?: number, @Query('country') country?: string) {
    return this.institutesService.getRecent(lat ? Number(lat) : undefined, lng ? Number(lng) : undefined, country);
  }

  @Get('metadata/lists')
  @ApiOperation({ summary: 'Get list of cities and services for dropdowns' })
  metadata(@Query('country') country?: string) {
    return this.institutesService.getMetadata(country);
  }

  @Get('sitemap')
  @ApiOperation({ summary: 'Get lightweight institute data for sitemap generation' })
  sitemap() {
    return this.institutesService.getSitemapData();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific institute' })
  @ApiResponse({ status: 200, description: 'Return a single institute with all its branches and services.' })
  @ApiResponse({ status: 404, description: 'Institute not found.' })
  async findOne(@Param('id') id: string) {
    const institute = await this.institutesService.findOne(id);
    if (!institute) throw new NotFoundException('Institute not found');
    return institute;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an institute' })
  async deleteInstitute(@Param('id') id: string) {
    return this.institutesService.delete(id);
  }

  @Post('onboard')
  @ApiOperation({ summary: 'Register a new institute and owner' })
  @ApiResponse({ status: 201, description: 'Institute registration initiated.' })
  async onboard(@Body() onboardDto: OnboardInstituteDto) {
    try {
      return await this.institutesService.onboard(onboardDto);
    } catch (error: any) {
      console.error('Onboard error:', error);
      
      // Handle Prisma P2002 (Unique constraint failed)
      if (error.code === 'P2002' || error.message?.includes('χρησιμοποιείται ήδη')) {
        throw new ConflictException('Αυτό το email χρησιμοποιείται ήδη.');
      }
      
      if (error.message?.includes('Invalid') || error.message?.includes('missing')) {
        throw new BadRequestException(error.message);
      }
      
      throw new InternalServerErrorException(error.message || 'Internal Server Error during onboarding');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login for owners and admins' })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.institutesService.login(loginDto.email, loginDto.password);
    } catch (error: any) {
      if (error.message === 'Invalid credentials' || error.message === 'User not found') {
        throw new UnauthorizedException('Λανθασμένα στοιχεία σύνδεσης.');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  async forgotPassword(@Body('email') email: string) {
    return this.institutesService.requestPasswordReset(email);
  }

  @Post('auth/reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  async resetPassword(@Body() dto: any) {
    return this.institutesService.resetPassword(dto.token, dto.password);
  }

  @Get('owner/:id')
  @ApiOperation({ summary: 'Get institutes for a specific owner' })
  async findByOwner(@Param('id') ownerId: string) {
    return this.institutesService.findByOwner(ownerId);
  }

  @Post('general/contact')
  @ApiOperation({ summary: 'Send a general platform contact message' })
  async sendGeneralContact(
    @Body() dto: CreateContactRequestDto
  ) {
    return this.institutesService.createContactRequest(null, dto);
  }

  @Post(':id/contact')
  @ApiOperation({ summary: 'Send a contact message to an institute' })
  async sendContact(
    @Param('id') id: string,
    @Body() dto: CreateContactRequestDto
  ) {
    return this.institutesService.createContactRequest(id, dto);
  }
}
