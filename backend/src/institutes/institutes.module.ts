import { Module } from '@nestjs/common';
import { InstitutesController } from './institutes.controller';
import { OwnerInstitutesController } from './owner-institutes.controller';
import { InstitutesService } from './institutes.service';
import { InstituteMgmtService } from './institute-mgmt.service';
import { OnboardingController } from './onboarding/onboarding.controller';
import { OnboardingService } from './onboarding/onboarding.service';

@Module({
  controllers: [InstitutesController, OwnerInstitutesController, OnboardingController],
  providers: [InstitutesService, InstituteMgmtService, OnboardingService],
  exports: [InstitutesService, InstituteMgmtService, OnboardingService]
})
export class InstitutesModule {}
