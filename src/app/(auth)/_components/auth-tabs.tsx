import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthTabsProps {
  defaultValue?: string;
  value?: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}

export function AuthTabs({ defaultValue = "sign-in", value, onValueChange, children }: AuthTabsProps) {
  return (
    <Tabs value={value} defaultValue={defaultValue} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sign-in">Entrar</TabsTrigger>
        <TabsTrigger value="sign-up">Cadastrar</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
