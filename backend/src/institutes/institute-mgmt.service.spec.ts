import { Test, TestingModule } from '@nestjs/testing';
import { InstituteMgmtService } from './institute-mgmt.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('InstituteMgmtService', () => {
  let service: InstituteMgmtService;
  let prisma: PrismaService;

  const mockPrisma = {
    institute: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    instituteRevision: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstituteMgmtService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<InstituteMgmtService>(InstituteMgmtService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('updateProfile', () => {
    const instId = 'inst-1';
    const currentInst = { id: instId, name: 'Old School', slug: 'old-school', status: 'APPROVED' };

    it('should update non-sensitive fields immediately', async () => {
      mockPrisma.institute.findUnique.mockResolvedValue(currentInst);
      const dto = { description: 'New description' };

      await service.updateProfile(instId, dto);

      expect(mockPrisma.institute.update).toHaveBeenCalledWith({
        where: { id: instId },
        data: { description: 'New description' },
      });
      expect(mockPrisma.instituteRevision.create).not.toHaveBeenCalled();
    });

    it('should divert sensitive fields to revision', async () => {
      mockPrisma.institute.findUnique.mockResolvedValue(currentInst);
      const dto = { name: 'New School', description: 'New desc' };

      await service.updateProfile(instId, dto);

      // Description updated immediately
      expect(mockPrisma.institute.update).toHaveBeenCalledWith({
        where: { id: instId },
        data: { description: 'New desc' },
      });

      // Name diverted to revision
      expect(mockPrisma.instituteRevision.create).toHaveBeenCalledWith({
        data: {
          instituteId: instId,
          proposedData: { name: 'New School' },
          currentData: expect.objectContaining({ name: 'Old School' }),
          status: 'PENDING',
        },
      });
    });

    it('should throw NotFoundException if institute missing', async () => {
      mockPrisma.institute.findUnique.mockResolvedValue(null);
      await expect(service.updateProfile('invalid', {})).rejects.toThrow(NotFoundException);
    });
  });
});
