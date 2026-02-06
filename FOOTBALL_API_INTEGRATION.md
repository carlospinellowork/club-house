# ⚽ Integração Football API - ClubHouse FC

## 📋 Resumo

Integração completa com a **API-Football** para buscar times, estatísticas, jogos ao vivo e muito mais!

## 🚀 Features Implementadas

### ✅ 1. Service Layer (`src/lib/football-api.ts`)
- Busca de times por nome
- Próximos jogos de um time
- Últimos resultados
- Classificação de campeonatos
- Jogos ao vivo

### ✅ 2. tRPC Router (`src/server/routers/football.ts`)
- `football.searchTeams` - Buscar times
- `football.getTeam` - Detalhes de um time
- `football.getNextFixtures` - Próximos jogos
- `football.getLastFixtures` - Últimos resultados
- `football.getStandings` - Classificação
- `football.getLiveFixtures` - Jogos ao vivo

### ✅ 3. Componentes React

#### `TeamAutocomplete` (`src/components/team-autocomplete.tsx`)
Autocomplete com busca em tempo real de times.

**⚠️ REQUER:** Componente `Command` do shadcn/ui

#### `NextMatchWidget` (`src/components/next-match-widget.tsx`)
Widget para exibir o próximo jogo de um time no perfil.

## 🔧 Setup Necessário

### 1. Obter API Key (GRÁTIS)

1. Acesse: https://www.api-football.com/
2. Crie uma conta gratuita
3. Copie sua API Key
4. **Limite gratuito:** 100 requests/dia

### 2. Configurar Variável de Ambiente

Adicione no seu arquivo `.env`:

```bash
FOOTBALL_API_KEY="sua-api-key-aqui"
```

### 3. Instalar Componente Command (shadcn/ui)

O componente `TeamAutocomplete` requer o componente `Command`:

```bash
npx shadcn@latest add command
```

Ou, se preferir, instale manualmente:

```bash
npm install cmdk
```

E crie o arquivo `src/components/ui/command.tsx` seguindo a documentação do shadcn/ui.

### 4. Instalar Componente Popover (se não tiver)

```bash
npx shadcn@latest add popover
```

## 📦 Como Usar

### Buscar Times (Autocomplete)

```tsx
import { TeamAutocomplete } from "@/components/team-autocomplete";

function MyComponent() {
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);

  return (
    <TeamAutocomplete
      value={teamName}
      onValueChange={setTeamName}
      onTeamSelect={(id, name, logo) => {
        setTeamId(id);
        console.log("Time selecionado:", { id, name, logo });
      }}
      placeholder="Buscar time favorito..."
    />
  );
}
```

### Exibir Próximo Jogo

```tsx
import { NextMatchWidget } from "@/components/next-match-widget";

function ProfilePage() {
  const teamId = 33; // ID do time (ex: Manchester United)
  const teamName = "Manchester United";

  return (
    <NextMatchWidget 
      teamId={teamId} 
      teamName={teamName} 
    />
  );
}
```

### Usar tRPC Diretamente

```tsx
import { trpc } from "@/lib/trpc";

function MyComponent() {
  // Buscar times
  const { data: teams } = trpc.football.searchTeams.useQuery({
    search: "Barcelona",
  });

  // Próximos jogos
  const { data: fixtures } = trpc.football.getNextFixtures.useQuery({
    teamId: 529, // Barcelona
    limit: 5,
  });

  // Classificação
  const { data: standings } = trpc.football.getStandings.useQuery({
    teamId: 529,
  });

  return (
    <div>
      {/* Renderizar dados */}
    </div>
  );
}
```

## 🎯 Próximos Passos Sugeridos

### 1. Integrar no Onboarding
Substituir o input de texto por `TeamAutocomplete` no wizard de onboarding.

### 2. Adicionar Widget no Perfil
Exibir o próximo jogo do time favorito usando `NextMatchWidget`.

### 3. Feed de Jogos ao Vivo
Criar uma página com jogos ao vivo usando `football.getLiveFixtures`.

### 4. Comparação de Times
Permitir membros compararem estatísticas dos seus times favoritos.

### 5. Notificações de Gols
Implementar sistema de notificações quando o time favorito marca.

## 📊 Estrutura de Dados

### Team
```typescript
{
  id: number;
  name: string;
  logo: string;
  country: string;
  founded: number;
  venue: string;
  city: string;
}
```

### Fixture (Jogo)
```typescript
{
  id: number;
  date: string;
  timestamp: number;
  status: { long: string; short: string; elapsed: number | null };
  league: { name: string; logo: string; country: string };
  home: { id: number; name: string; logo: string };
  away: { id: number; name: string; logo: string };
  goals: { home: number | null; away: number | null };
  venue: { name: string; city: string };
}
```

### Standing (Classificação)
```typescript
{
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  form: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}
```

## 🔥 Exemplos de IDs de Times Populares

- **33** - Manchester United
- **40** - Liverpool
- **50** - Manchester City
- **529** - Barcelona
- **541** - Real Madrid
- **85** - Paris Saint Germain
- **496** - Juventus
- **505** - Inter Milan
- **489** - AC Milan
- **497** - AS Roma

Para encontrar o ID de outros times, use a busca:

```tsx
const { data } = trpc.football.searchTeams.useQuery({ 
  search: "Flamengo" 
});
```

## 💡 Dicas de Performance

1. **Cache:** As queries já têm `staleTime` configurado para evitar requests desnecessários
2. **Limite de Requests:** Monitore o uso para não exceder 100 requests/dia
3. **Fallback:** Sempre trate casos onde a API pode estar indisponível

## 🐛 Troubleshooting

### Erro: "Football API error"
- Verifique se a API key está correta no `.env`
- Confirme que não excedeu o limite de 100 requests/dia
- Verifique se a API está online: https://status.api-football.com/

### Componente Command não encontrado
```bash
npx shadcn@latest add command
```

### Imagens não carregam
As logos dos times vêm de URLs externas. Adicione no `next.config.js`:

```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'media.api-sports.io',
    },
  ],
}
```

## 📚 Documentação da API

- **API-Football Docs:** https://www.api-football.com/documentation-v3
- **Dashboard:** https://dashboard.api-football.com/

---

**Desenvolvido para ClubHouse FC** ⚽🏆
