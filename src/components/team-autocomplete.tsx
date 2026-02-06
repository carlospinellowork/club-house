"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TeamAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onTeamSelect?: (teamId: number, teamName: string, teamLogo: string) => void;
  placeholder?: string;
  className?: string;
}

export function TeamAutocomplete({
  value,
  onValueChange,
  onTeamSelect,
  placeholder = "Buscar time...",
  className,
}: TeamAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: teams, isLoading } = trpc.football.searchTeams.useQuery(
    { search },
    {
      enabled: search.length >= 2,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    }
  );

  const handleSelect = (teamName: string, teamId: number, teamLogo: string) => {
    onValueChange(teamName);
    onTeamSelect?.(teamId, teamName, teamLogo);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal hover:bg-accent/50 transition-colors",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Digite o nome do time..."
            value={search}
            onValueChange={setSearch}
            className="h-12"
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isLoading && search.length < 2 && (
              <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                Digite pelo menos 2 caracteres para buscar
              </CommandEmpty>
            )}

            {!isLoading && search.length >= 2 && teams?.length === 0 && (
              <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                Nenhum time encontrado
              </CommandEmpty>
            )}

            {teams && teams.length > 0 && (
              <CommandGroup heading={`${teams.length} times encontrados`}>
                {teams.map((team) => (
                  <CommandItem
                    key={team.id}
                    value={team.name}
                    onSelect={() => handleSelect(team.name, team.id, team.logo)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent"
                  >
                    <div className="relative h-8 w-8 flex-shrink-0">
                      <Image
                        src={team.logo}
                        alt={team.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{team.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {team.city}, {team.country}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        value === team.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
