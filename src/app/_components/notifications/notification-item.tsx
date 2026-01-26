"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { TNotification } from "@/types/notification";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { Heart, MessageSquare, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: TNotification;
  handleMarkAsRead: (notificationId: string) => void;
}

export function NotificationItem({ notification, handleMarkAsRead }: NotificationItemProps) {
  const router = useRouter();
  const isUnread = !notification.read;

  const handleNotificationClick = () => {
    handleMarkAsRead(notification.id);

    if (notification.type === "FOLLOW_USER") {
      router.push(`/profile/${notification.actorId}`);
    } else if (notification.postId) {
      router.push(`/feed/${notification.postId}`);
    }
  };

  const getNotificationConfig = () => {
    if (notification.type === "LIKE_POST") {
      return {
        icon: <Heart className="h-3 w-3 fill-red-500 text-red-500" />,
        label: "curtiu seu post",
        color: "bg-red-500/10",
      };
    }

    if (notification.type === "COMMENT_POST") {
      return {
        icon: <MessageSquare className="h-3 w-3 fill-blue-500 text-blue-500" />,
        label: "comentou no seu post",
        color: "bg-blue-500/10",
      };
    }

    if (notification.type === "FOLLOW_USER") {
      return {
        icon: <UserPlus className="h-3 w-3 text-green-500" />,
        label: "começou a te seguir",
        color: "bg-green-500/10",
      };
    }

    return null;
  };

  const config = getNotificationConfig();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: "var(--color-muted/30)" }}
      className={cn(
        "flex items-center gap-3 p-4 border-b border-border/40 last:border-0 cursor-pointer transition-colors relative group",
        isUnread && "bg-primary/5"
      )}
      onClick={handleNotificationClick}
    >
      <div className="relative">
        <Avatar className="h-10 w-10 border border-border/50">
          {notification.actor.image && (
            <AvatarImage src={notification.actor.image} className="object-cover" />
          )}
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
            {notification.actor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className={cn(
          "absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background shadow-sm",
          config?.color
        )}>
          {config?.icon}
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2 text-sm">
          <p className="font-medium text-foreground truncate">
            {notification.actor.name}
          </p>
          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-balance leading-tight text-muted-foreground group-hover:text-foreground/80 transition-colors">
          <span className="font-semibold">{config?.label}</span>
        </p>
      </div>

      {isUnread && (
        <div className="flex items-center self-center pl-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </motion.div>
  );
}