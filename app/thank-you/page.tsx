"use client"

import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CheckCircle2, ArrowLeft, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/Header"

function ThankYouContent() {
    const searchParams = useSearchParams()
    const reference = searchParams.get("ref")
    const amount = searchParams.get("amount")
    const currency = searchParams.get("currency") || "GHS"

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            <Header />

            <main className="container mx-auto flex flex-col items-center justify-center px-4 py-16 md:py-24">
                {/* Success Icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" style={{ animationDuration: "2s" }} />
                    <div className="relative rounded-full bg-primary/10 p-6">
                        <CheckCircle2 className="h-16 w-16 text-primary" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Thank You Message */}
                <h1 className="mb-3 text-center text-3xl font-bold tracking-tight md:text-4xl">
                    Thank You for Your Donation!
                </h1>
                <p className="mb-8 max-w-md text-center text-muted-foreground">
                    Your generous contribution makes a real difference to the Ghana International School community.
                </p>

                {/* Receipt Card */}
                <Card className="mb-8 w-full max-w-md border-0 shadow-lg ring-1 ring-black/5">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Receipt className="h-4 w-4" />
                            Payment Receipt
                        </div>
                        <Separator className="mb-4" />

                        <div className="space-y-3">
                            {amount && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Amount</span>
                                    <span className="text-lg font-bold text-primary">
                                        {currency} {Number(amount).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            {reference && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Reference</span>
                                    <span className="font-mono text-sm">{reference}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    Completed
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Make Another Donation
                        </Link>
                    </Button>
                </div>

                {/* Footer note */}
                <p className="mt-12 max-w-sm text-center text-xs text-muted-foreground">
                    A confirmation email will be sent to you shortly. If you have any questions, please don&apos;t hesitate to contact us.
                </p>
            </main>
        </div>
    )
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    )
}
