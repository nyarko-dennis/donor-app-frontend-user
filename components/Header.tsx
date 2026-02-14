import Image from "next/image"
import Link from "next/link"
import { Headphones } from "lucide-react"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    {/* Using the GIS logo path as mentioned in previous context, though file check showed it exists */}
                    <div className="relative h-12 w-48 md:h-16 md:w-64">
                        <Image
                            src="/images/gis_logo.png"
                            alt="Ghana International School"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </div>
                <Link
                    href="#"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    <Headphones className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Need Help?</span>
                </Link>
            </div>
        </header>
    )
}
