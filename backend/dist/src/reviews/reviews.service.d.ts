import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        instituteId: string;
        userId?: string;
        guestName?: string;
        rating: number;
        comment?: string;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.RevStatus;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        userId: string | null;
        rating: number;
        comment: string | null;
        guestName: string | null;
    }>;
    findByInstitute(instituteId: string): Promise<({
        user: {
            firstName: string | null;
            lastName: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.RevStatus;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        userId: string | null;
        rating: number;
        comment: string | null;
        guestName: string | null;
    })[]>;
    findPending(): Promise<({
        institute: {
            name: string;
        };
        user: {
            firstName: string | null;
            lastName: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.RevStatus;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        userId: string | null;
        rating: number;
        comment: string | null;
        guestName: string | null;
    })[]>;
    moderate(id: string, status: 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.RevStatus;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        userId: string | null;
        rating: number;
        comment: string | null;
        guestName: string | null;
    }>;
    findRecentApproved(limit?: number): Promise<({
        institute: {
            id: string;
            name: string;
            slug: string | null;
            images: {
                id: string;
                createdAt: Date;
                instituteId: string;
                url: string;
                caption: string | null;
                order: number;
                isApproved: boolean;
            }[];
        };
        user: {
            firstName: string | null;
            lastName: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.RevStatus;
        createdAt: Date;
        updatedAt: Date;
        instituteId: string;
        userId: string | null;
        rating: number;
        comment: string | null;
        guestName: string | null;
    })[]>;
}
