import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(data: {
        instituteId: string;
        rating: number;
        comment?: string;
        guestName?: string;
        guestEmail?: string;
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
        guestEmail: string | null;
    }>;
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
        guestEmail: string | null;
    })[]>;
    findRecent(): Promise<({
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
        guestEmail: string | null;
    })[]>;
    findByInstitute(id: string): Promise<({
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
        guestEmail: string | null;
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
        guestEmail: string | null;
    }>;
}
