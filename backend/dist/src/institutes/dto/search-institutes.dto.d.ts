export declare class SearchInstitutesDto {
    lat?: number;
    lng?: number;
    radius?: number;
    serviceId?: string;
    cityId?: string;
    query?: string;
    sort?: 'distance' | 'newest';
    location?: string;
    minRating?: number;
    page?: number;
    limit?: number;
}
