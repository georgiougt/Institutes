import { Module } from '@nestjs/common';
import { InstitutesController } from './institutes.controller';
import { OwnerInstitutesController } from './owner-institutes.controller';
import { InstitutesService } from './institutes.service';
import { InstituteMgmtService } from './institute-mgmt.service';
import { OnboardingController } from './onboarding/onboarding.controller';
import { OnboardingService } from './onboarding/onboarding.service';
import { StorageService } from '../common/storage/storage.service';
import { OwnerAccountController } from './owner-account.controller';

@Module({
  controllers: [InstitutesController, OwnerInstitutesController, OnboardingController, OwnerAccountController],
  providers: [InstitutesService, InstituteMgmtService, OnboardingService, StorageService],
  exports: [InstitutesService, InstituteMgmtService, OnboardingService, StorageService]
})
export class InstitutesModule {}
