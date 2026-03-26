import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { PermissionGuard } from './permissions.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminRole, InstituteRole } from '../decorators/permissions.decorator';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let reflector: Reflector;
  let prisma: PrismaService;

  const mockPrisma = {
    instituteMember: {
      findUnique: jest.fn(),
    },
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    guard = module.get<PermissionGuard>(PermissionGuard);
    reflector = module.get<Reflector>(Reflector);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow if no permissions required', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);
    const context = createMockContext({}, {});
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException if no user', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({ adminRoles: [AdminRole.SUPER_ADMIN] });
    const context = createMockContext(null, {});
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should allow Super Admin regardless of role requirement', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({ adminRoles: [AdminRole.OPS_ADMIN] });
    const context = createMockContext({ id: 'u1', adminRole: 'SUPER_ADMIN' }, {});
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should allow if admin role matches', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({ adminRoles: [AdminRole.OPS_ADMIN] });
    const context = createMockContext({ id: 'u1', adminRole: 'OPS_ADMIN' }, {});
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should allow if institute role matches', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({ instituteRoles: [InstituteRole.OWNER] });
    const context = createMockContext({ id: 'u1' }, { id: 'inst1' });
    mockPrisma.instituteMember.findUnique.mockResolvedValue({ role: 'OWNER' });

    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if institute role does not match', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({ instituteRoles: [InstituteRole.OWNER] });
    const context = createMockContext({ id: 'u1' }, { id: 'inst1' });
    mockPrisma.instituteMember.findUnique.mockResolvedValue({ role: 'STAFF' });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  function createMockContext(user: any, params: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params,
          query: {},
          body: {},
        }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }
});
