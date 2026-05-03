export declare class UpdateInstituteProfileDto {
    name?: string;
    description?: string;
    website?: string;
    logoUrl?: string;
}
export declare class AddInquiryNoteDto {
    content: string;
    authorId: string;
}
export declare class BulkUpdateServicesDto {
    serviceIds: string[];
}
export declare class UpdateBranchDto {
    name?: string;
    address?: string;
    phone?: string;
    cityId?: string;
    latitude?: number;
    longitude?: number;
}
