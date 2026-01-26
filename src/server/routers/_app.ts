import { router } from "../trpc";
import { CommentRouter } from "./comment";
import { FollowRouter } from "./follow";
import { LikeRouter } from "./like";
import { MemberProfileRouter } from "./members";
import { notificationRouter } from "./notification";
import { PostRouter } from "./post";

export const appRouter = router({
  member: MemberProfileRouter,
  post: PostRouter,
  like: LikeRouter,
  follow: FollowRouter,
  comment: CommentRouter,
  notification: notificationRouter
});

export type AppRouter = typeof appRouter;