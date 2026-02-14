import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const countries = [
    { value: "gh", label: "Ghana", code: "+233", flag: "🇬🇭" },
    { value: "ng", label: "Nigeria", code: "+234", flag: "🇳🇬" },
    { value: "us", label: "United States", code: "+1", flag: "🇺🇸" },
    { value: "gb", label: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { value: "ca", label: "Canada", code: "+1", flag: "🇨🇦" },
    { value: "de", label: "Germany", code: "+49", flag: "🇩🇪" },
    { value: "fr", label: "France", code: "+33", flag: "🇫🇷" },
    { value: "za", label: "South Africa", code: "+27", flag: "🇿🇦" },
    { value: "ke", label: "Kenya", code: "+254", flag: "🇰🇪" },
    { value: "ci", label: "Ivory Coast", code: "+225", flag: "🇨🇮" },
]

interface CountrySelectorProps {
    value?: string
    onChange?: (value: string) => void
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedCountry, setSelectedCountry] = React.useState(countries[0])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[120px] justify-between px-3 focus:border-primary"
                >
                    <span className="flex items-center gap-2">
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {countries.map((country) => (
                                <CommandItem
                                    key={country.value}
                                    value={country.label}
                                    onSelect={(currentValue: string) => {
                                        setSelectedCountry(country)
                                        // We typically want to pass the dialing code or country code up
                                        // For now, let's pass the dialing code as that seems to be what was there
                                        // But usually the phone input is separate.
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedCountry.value === country.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="mr-2 text-xl">{country.flag}</span>
                                    {country.label} ({country.code})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
