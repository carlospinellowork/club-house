import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { TNotification } from "@/types/notification";
import { Bell } from "lucide-react";
import { trpc } from "../../../lib/trpc";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  notifications: TNotification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  const utils = trpc.useUtils();

  const markAllAsRead = trpc.notification.markAllAsRead.useMutation({
    onSuccess: () => {
      utils.notification.getUnread.invalidate();
    }
  });

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const markAsRead = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      utils.notification.getUnread.invalidate();
    }
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate({ notificationId });
  };

  if (notifications.length === 0) {
    return (
      <Empty
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
      >
        <EmptyMedia variant="icon">
          <Bell className="h-10 w-10 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Nenhuma notificação por enquanto.</EmptyTitle>
        <EmptyDescription>
          Você ainda não tem notificações.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col max-h-[450px]">
      <div className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-popover/80 backdrop-blur-sm z-10">
        <h3 className="font-semibold text-sm">Notificações</h3>
        <button onClick={() => handleMarkAllAsRead()} className="text-xs text-primary hover:underline font-medium px-2 py-1 rounded-md hover:bg-primary/5 transition-colors">
          Marcar todas como lidas
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col">
          {notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} handleMarkAsRead={handleMarkAsRead} />
          ))}
        </div>
      </div>
    </div>
  )
}