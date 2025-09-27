"use client";

import { ModeToggle } from "@/components/mode-color-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Bell, LogOut, Settings, Shield, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useLogout } from "../auth/mutation";
import { UserSearchDialog } from "./user-search-dialog";

interface Props {
  user: { id: string; name?: string; image?: string; email?: string } | null;
}

export default function HeaderClient({ user }: Props) {
  const router = useRouter();

  const { mutate: logout } = useLogout({ router });

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";

    const names = name.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
    return initials.slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={user?.id ? `/feed/${user.id}` : "/"}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity animate-in fade-in-50"
          >
            <span className="text-sm font-bold text-primary dark:text-foreground">
              <Shield className="h-8 w-8 text-primary dark:text-foreground" />
            </span>
            <h1 className="text-xl font-bold text-foreground">ClubHouse FC</h1>
          </Link>
          <ModeToggle />
        </div>

        <div className="flex items-center space-x-2">
          {user?.id && (
            <>
              <UserSearchDialog />

              <Button variant="ghost" size="sm" className="rounded-full">
                <Bell className="h-4 w-4" />
              </Button>

              <Menubar className="border-none bg-transparent">
                <MenubarMenu>
                  <MenubarTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          className="object-cover"
                          src={user?.image || "/diverse-user-avatars.png"}
                          alt={user?.name || "Usuário"}
                        />
                        <AvatarFallback className="bg-primary text-primary dark:text-foreground">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent align="end" className="min-w-[200px]">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">
                        {user?.name || "Usuário"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{user?.email}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user?.email}</p>
                          </TooltipContent>
                        </Tooltip>
                      </p>
                    </div>

                    <MenubarSeparator />

                    <MenubarItem
                      onClick={() => router.push(`/profile/${user?.id}`)}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Meu Perfil
                    </MenubarItem>

                    <MenubarItem className="cursor-pointer flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Configurações
                    </MenubarItem>

                    <MenubarSeparator />

                    <MenubarItem
                      onClick={() => logout()}
                      className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
