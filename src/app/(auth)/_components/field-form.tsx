import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface IFieldForm extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
  togglePassword?: () => void;
  showPassword?: boolean;
}

export function FieldForm({
  label,
  icon,
  error,
  togglePassword,
  showPassword,
  placeholder,
  ...props
}: IFieldForm) {
  return (
    <div className="space-y-2">
      <Label className={error ? "text-red-500" : ""}>{label}</Label>
      <div className="relative">
        {icon && (
          <span className={`absolute left-3 top-3 h-4 w-4 text-muted-foreground flex items-center justify-center ${error ? "text-red-500 animate-bounce" : ""}`}>
            {icon}
          </span>
        )}
        <Input
          {...props}
          placeholder={placeholder}
          className={`pl-10 ${togglePassword ? "pr-10" : ""} ${error ? "border-red-500" : ""}`}
        />
        {togglePassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
