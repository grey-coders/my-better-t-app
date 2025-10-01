import { protectedProcedure, router } from "../lib/trpc";
import { PrismaClient } from "../../generated/prisma/index.js";
import { z } from "zod";

const prisma = new PrismaClient();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validation schemas
const uploadCVSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title must be 50 characters or less"),
  description: z.string().min(1, "Description is required").max(300, "Description must be 300 characters or less"),
  fileName: z.string().min(1, "File name is required"),
  fileData: z.string().min(1, "File data is required"), // base64 encoded
  mimeType: z.enum([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ], { errorMap: () => ({ message: "Only PDF, DOC, and DOCX files are allowed" }) }),
  fileSize: z.number().max(MAX_FILE_SIZE, "File size must be less than 5MB"),
});

const listCVsSchema = z.object({
  limit: z.number().min(1).max(50).default(10),
  cursor: z.string().optional(),
});

export const cvRouter = router({
  // Upload CV endpoint
  upload: protectedProcedure
    .input(uploadCVSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if title already exists for this user (Option 3 & 4: soft prevention)
      const existingCV = await prisma.cV.findFirst({
        where: {
          userId,
          title: input.title,
        },
      });

      let finalTitle = input.title;

      // Auto-append version number if title exists (Option 4)
      if (existingCV) {
        const titlePattern = new RegExp(`^${input.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s\\((\\d+)\\))?$`);
        const allMatchingTitles = await prisma.cV.findMany({
          where: {
            userId,
            title: {
              contains: input.title,
            },
          },
          select: {
            title: true,
          },
        });

        const versions = allMatchingTitles
          .map(cv => {
            const match = cv.title.match(titlePattern);
            if (!match) return 0;
            return match[2] ? parseInt(match[2]) : 1;
          })
          .filter(v => v > 0);

        const nextVersion = versions.length > 0 ? Math.max(...versions) + 1 : 2;
        finalTitle = `${input.title} (${nextVersion})`;
      }

      // Decode base64 to Buffer
      const fileBuffer = Buffer.from(input.fileData, "base64");

      // Create CV record
      const cv = await prisma.cV.create({
        data: {
          title: finalTitle,
          description: input.description,
          fileName: input.fileName,
          fileData: fileBuffer,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
          userId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        cv,
        titleChanged: finalTitle !== input.title,
        originalTitle: input.title,
      };
    }),

  // List CVs endpoint with cursor-based pagination
  list: protectedProcedure
    .input(listCVsSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const limit = input.limit;

      const cvs = await prisma.cV.findMany({
        where: {
          userId,
        },
        take: limit + 1, // Take one extra to determine if there's a next page
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
          createdAt: true,
          updatedAt: true,
          // Explicitly exclude fileData for performance
        },
      });

      let nextCursor: string | undefined = undefined;

      if (cvs.length > limit) {
        const nextItem = cvs.pop(); // Remove the extra item
        nextCursor = nextItem?.id;
      }

      return {
        items: cvs,
        nextCursor,
      };
    }),
});
