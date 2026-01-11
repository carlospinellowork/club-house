import { Notification } from "../types/notification";

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'LIKE_POST',
    actor: {
      id: 'u1',
      name: 'Maria Silva',
    },
    postId: 'p1',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'COMMENT_POST',
    actor: {
      id: 'u3',
      name: 'Ana Oliveira',
    },
    postId: 'p2',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  }
]
