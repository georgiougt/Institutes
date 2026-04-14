import { Controller, Post, Get, Body, Param, UseGuards, Req, Patch, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { SupabaseAuthGuard } from '../common/auth/supabase-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Post a new review (Guest)' })
  async create(@Body() data: { instituteId: string; rating: number; comment?: string; guestName?: string }) {
    return this.reviewsService.create({ ...data });
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get all pending reviews for moderation' })
  async findPending() {
    return this.reviewsService.findPending();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get latest approved reviews' })
  async findRecent() {
    return this.reviewsService.findRecentApproved();
  }

  @Get('institute/:id')
  @ApiOperation({ summary: 'Get approved reviews for an institute' })
  async findByInstitute(@Param('id') id: string) {
    return this.reviewsService.findByInstitute(id);
  }

  @Patch(':id/moderate')
  @ApiOperation({ summary: 'Moderate a review (Admin only)' })
  // @UseGuards(SupabaseAuthGuard, AdminGuard) // FUTURE: Add AdminGuard
  async moderate(@Param('id') id: string, @Body('status') status: 'APPROVED' | 'REJECTED') {
    return this.reviewsService.moderate(id, status);
  }
}
