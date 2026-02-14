import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AmountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    currency?: string
}

const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
    ({ className, currency = "GHS", ...props }, ref) => {
        return (
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    {currency}
                </div>
                <Input
                    type="number"
                    className={cn(
                        "pl-14 text-lg font-bold h-12",
                        className
                    )}
                    placeholder="0.00"
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
AmountInput.displayName = "AmountInput"

export { AmountInput }
