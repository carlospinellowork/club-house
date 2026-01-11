'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockNotifications } from "@/mocks/notification";
import { Bell } from "lucide-react";
import { NotificationList } from "./notification-list";

export function NotificationBell() {
  const unreadNotifications = mockNotifications.filter(notification => !notification.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative rounded-full h-9 w-9 p-0 hover:bg-muted/50 transition-colors" aria-label="Notificações">
          <Bell className="h-4 w-4" />

          {unreadNotifications > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-destructive text-destructive-foreground ring-2 ring-background">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-80 p-0 shadow-2xl border-border/50 overflow-hidden">
        <NotificationList notifications={mockNotifications} />
      </PopoverContent>
    </Popover>
  )
}