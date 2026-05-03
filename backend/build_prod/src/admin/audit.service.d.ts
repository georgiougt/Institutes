import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(params: {
        actorId?: string;
        actorRole?: string;
        actionType: string;
        entityType?: string;
        entityId?: string;
        oldValues?: any;
        newValues?: any;
        reason?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        actorRole: string | null;
        actionType: string;
        entityType: string | null;
        entityId: string | null;
        oldValues: import("@prisma/client/runtime/library").JsonValue | null;
        newValues: import("@prisma/client/runtime/library").JsonValue | null;
        reason: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        actorId: string | null;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        actionType?: string;
        entityType?: string;
        entityId?: string;
        actorId?: string;
        fromDate?: Date;
        toDate?: Date;
    }): Promise<{
        data: ({
            actor: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
                adminRole: import("@prisma/client").$Enums.AdminRole | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            actorRole: string | null;
            actionType: string;
            entityType: string | null;
            entityId: string | null;
            oldValues: import("@prisma/client/runtime/library").JsonValue | null;
            newValues: import("@prisma/client/runtime/library").JsonValue | null;
            reason: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            actorId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
}
