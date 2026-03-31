import { LessonContentType } from '@prisma/client';
export declare class CreateLessonDto {
    title: string;
    order?: number;
    description?: string;
    contentType: LessonContentType;
    body?: string;
    contentUrl?: string;
}
