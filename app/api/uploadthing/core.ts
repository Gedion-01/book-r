import { verifyAuth } from "@/lib/auth";
// import { isTeacher } from "@/lib/teacher";
// import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = () => {
  //   const { userId } = auth();
  //   const isAuthorized = isTeacher(userId);
  //   if (!userId || !isAuthorized) throw new Error("Unauthorized");
  //   return { userId };
  const res = verifyAuth("userId");
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
