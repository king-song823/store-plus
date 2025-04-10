import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/auth';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 30 } })
    .middleware(async () => {
      const session = await auth();

      if (!session) throw new UploadThingError('Unauthorized');

      return { userId: session?.user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
  pdfUploader: f({ blob: { maxFileSize: '32MB', maxFileCount: 30 } })
    .middleware(async () => {
      const session = await auth();

      if (!session) throw new UploadThingError('Unauthorized');

      return { userId: session?.user.id };
    })
    .onUploadComplete(({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
