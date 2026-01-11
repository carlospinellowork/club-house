export type NotificationType = 'LIKE_POST' | 'COMMENT_POST'

export interface Notification {
  id: string
  type: NotificationType
  actor: {
    id: string
    name: string
    avatarUrl?: string
  }
  postId?: string
  commentId?: string
  read: boolean
  createdAt: string
}
