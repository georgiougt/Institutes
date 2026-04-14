import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { instituteId: string; userId?: string; guestName?: string; rating: number; comment?: string }) {
    return this.prisma.review.create({
      data: {
        ...data,
        status: 'PENDING', // Require moderation by default
      },
    });
  }

  async findByInstitute(instituteId: string) {
    return this.prisma.review.findMany({
      where: { 
        instituteId,
        status: 'APPROVED' // Only show approved reviews to public
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending() {
    return this.prisma.review.findMany({
      where: { status: 'PENDING' },
      include: {
        institute: {
          select: {
            name: true,
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async moderate(id: string, status: 'APPROVED' | 'REJECTED') {
    return this.prisma.review.update({
      where: { id },
      data: { status },
    });
  }

  async findRecentApproved(limit: number = 6) {
    return this.prisma.review.findMany({
      where: { status: 'APPROVED' },
      include: {
        institute: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
