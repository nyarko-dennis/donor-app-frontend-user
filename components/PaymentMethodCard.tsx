import { RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Smartphone, CreditCard } from "lucide-react"

interface PaymentMethodCardProps {
    value: string
    id: string
    label: string
    icon?: "card" | "mobile"
    selectedValue?: string
}

export function PaymentMethodCard({ value, id, label, icon, selectedValue }: PaymentMethodCardProps) {
    const isSelected = selectedValue === value

    return (
        <Label
            htmlFor={id}
            className={cn(
                "flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all duration-200",
                isSelected ? "border-primary bg-accent/10" : "border-muted"
            )}
        >
            <div className="mb-3 rounded-full bg-secondary p-2 text-primary">
                {icon === "card" && <CreditCard className="h-6 w-6" />}
                {icon === "mobile" && <Smartphone className="h-6 w-6" />}
            </div>
            <span className="mb-2 block font-semibold">{label}</span>
            <RadioGroupItem value={value} id={id} className="sr-only" />
            <div
                className={cn(
                    "h-4 w-4 rounded-full border border-primary",
                    isSelected ? "bg-primary" : "bg-transparent"
                )}
            />
        </Label>
    )
}
