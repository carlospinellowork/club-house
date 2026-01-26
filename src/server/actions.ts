
"use server";

import { revalidatePath } from "next/cache";
import { api } from "./server-trpc";

export async function createPostAction(input: { content: string; image?: string }) {
  const caller = await api();
  const res = await caller.post.create(input);
  revalidatePath("/");
  return res;
}

export async function toggleLikeAction(input: { postId: string }) {
  const caller = await api();
  const res = await caller.like.toggleLike(input);
  revalidatePath("/");
  return res;
}

export async function toggleFollowAction(input: { userId: string }) {
  const caller = await api();
  const res = await caller.follow.toggleFollow(input);
  revalidatePath("/");
  return res;
}

export async function addCommentAction(input: { postId: string; content: string; parentId?: string }) {
  const caller = await api();
  const res = await caller.comment.addComment(input);
  revalidatePath("/");
  return res;
}

export async function updateProfileAction(input: { 
  id: string; 
  name: string; 
  location?: string; 
  bio?: string; 
  image?: string; 
}) {
  const caller = await api();
  const res = await caller.member.updateProfile(input);
  revalidatePath("/");
  return res;
}

export async function getUnreadNotificationsAction() {
  const caller = await api();
  const res = await caller.notification.getUnread();
  return res;
}

export async function markAllAsReadAction() {
  const caller = await api();
  const res = await caller.notification.markAllAsRead();
  return res;
}

export async function markAsReadAction(input: { notificationId: string }) {
  const caller = await api();
  const res = await caller.notification.markAsRead(input);
  return res;
}