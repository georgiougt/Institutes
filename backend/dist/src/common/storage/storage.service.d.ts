export declare class StorageService {
    private supabase;
    private readonly bucketName;
    constructor();
    uploadImage(file: Express.Multer.File, folder: string): Promise<string>;
}
