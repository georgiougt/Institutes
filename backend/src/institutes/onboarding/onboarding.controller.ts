import { Controller, Post, Body, Get, Query, Param, BadRequestException } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingSignupDto, UpdateDraftDto, ClaimSubmitDto, SearchClaimsDto } from './onboarding.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Onboarding')
@Controller('onboard')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Step 1: Create owner account' })
  signup(@Body() dto: OnboardingSignupDto) {
    return this.onboardingService.signup(dto);
  }

  @Post('draft')
  @ApiOperation({ summary: 'Save progress as draft' })
  updateDraft(@Body() dto: UpdateDraftDto) {
    return this.onboardingService.updateDraft(dto);
  }

  @Post('submit/:id')
  @ApiOperation({ summary: 'Final Step: Submit for review' })
  submit(@Param('id') id: string) {
    return this.onboardingService.submitForReview(id);
  }

  @Get('search-claim')
  @ApiOperation({ summary: 'Search for institutes to claim' })
  searchClaim(@Query() dto: SearchClaimsDto) {
    return this.onboardingService.searchToClaim(dto.query);
  }

  @Post('claim')
  @ApiOperation({ summary: 'Submit a claim request' })
  submitClaim(@Body() dto: ClaimSubmitDto) {
    return this.onboardingService.submitClaim(dto);
  }
}
