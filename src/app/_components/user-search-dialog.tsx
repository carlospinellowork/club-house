"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function UserSearchDialog() {
  const [query, setQuery] = useState("");
  const {
    data: results,
    refetch,
    isFetching,
  } = trpc.member.searchGlobal.useQuery({ query }, { enabled: false });

  const handleSearch = () => {
    if (query.trim().length > 0) refetch();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full">
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pesquisar usuários</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Nome ou email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={isFetching}>
            Buscar
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {results?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum usuário encontrado
            </p>
          )}

          {results?.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="flex items-center gap-2 p-2 rounded hover:bg-muted"
            >
              <Image
                width={32}
                height={32}
                src={user.image || "/diverse-user-avatars.png"}
                alt={user.name || "Usuário"}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
