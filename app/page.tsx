"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Lock, CreditCard, Smartphone, Loader2, ChevronsUpDown, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { CountrySelector } from "@/components/CountrySelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Header } from "@/components/Header"
import { AmountInput } from "@/components/AmountInput"
import { useCampaigns, useConstituencies, useSubConstituencies, useDonationCauses, useInitiateDonation } from "@/hooks/useDonationData"

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Phone number is required"),
  postcode: z.string().optional(),
  campaign: z.string({
    error: "Please select a campaign.",
  }),
  constituency: z.string({
    error: "Please select a constituency.",
  }),
  subConstituency: z.string().optional(),
  currency: z.string(),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    error: "Amount must be a positive number",
  }),
  donationCause: z.string({
    error: "Please select a cause.",
  }),
  paymentMethod: z.enum(["card", "mobile_money"], {
    error: "Please select a payment method.",
  }),
})

export default function DonationPage() {
  const router = useRouter()
  const { data: campaigns, isLoading: isLoadingCampaigns } = useCampaigns()
  const { data: constituencies, isLoading: isLoadingConstituencies } = useConstituencies()
  const { data: donationCauses, isLoading: isLoadingCauses } = useDonationCauses()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postcode: "",
      campaign: undefined,
      constituency: undefined,
      subConstituency: undefined,
      currency: "GHS",
      amount: "",
      donationCause: undefined,
      paymentMethod: undefined,
    },
  })

  const selectedConstituencyId = form.watch("constituency")
  const { data: subConstituencies, isLoading: isLoadingSubConstituencies } = useSubConstituencies(selectedConstituencyId)
  const initiateDonation = useInitiateDonation()
  const [subConstituencyOpen, setSubConstituencyOpen] = React.useState(false)

  const sortedSubConstituencies = React.useMemo(() => {
    if (!subConstituencies || !Array.isArray(subConstituencies)) return []
    return [...subConstituencies].sort((a: any, b: any) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
  }, [subConstituencies])

  const selectedPaymentMethod = form.watch("paymentMethod")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = await initiateDonation.mutateAsync({
        amount: Number(values.amount),
        email: values.email,
        payment_method: values.paymentMethod === "card" ? "Card" : "Mobile Money",
        campaignId: values.campaign,
        donation_cause: values.donationCause,
        donor: {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
          constituency_id: values.constituency,
          sub_constituency_id: values.subConstituency
        }
      });

      // Use PaystackPop with the backend's reference so webhook matches
      // important: do NOT pass access_code here, otherwise Paystack may ignore the reference
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: data.email,
        amount: data.amount * 100, // Paystack expects pesewas
        currency: values.currency || "GHS",
        ref: data.reference, // Use 'ref' or 'reference' depending on the library, but inline.js often takes 'ref' or just 'reference'
        reference: data.reference, // passing both to be safe, inline.js usually prioritizes reference
        channels: [selectedPaymentMethod === "mobile_money" ? "mobile_money" : "card"],
        onClose: () => {
          toast.info("Payment window closed.")
        },
        callback: (response: any) => {
          console.log("Payment complete:", response)
          toast.success("Payment successful!")
          router.push(`/thank-you?ref=${response.reference}&amount=${values.amount}&currency=${values.currency || "GHS"}`)
        },
      })
      handler.openIframe()

    } catch (error) {
      console.error("Donation initiation failed", error)
      toast.error("Failed to initiate donation. Please try again.")
    }
  }

  const paymentMethod = form.watch("paymentMethod")

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header />

      <main className="container mx-auto py-10 px-4 md:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* LEFT COLUMN - Billing Details */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Billing Details</h2>
                  <p className="text-muted-foreground">
                    Please provide your details to process the donation.
                  </p>
                </div>

                <Separator />

                <div className="grid gap-6">
                  {/* Campaign & Constituency */}
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="campaign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Campaign" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingCampaigns ? (
                                <div className="flex items-center justify-center p-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                              ) : (
                                campaigns?.data?.map((campaign: any) => (
                                  <SelectItem key={campaign.id} value={campaign.id}>
                                    {campaign.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="constituency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Constituency</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("subConstituency", ""); // Reset sub-constituency
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Constituency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isLoadingConstituencies ? (
                                  <div className="flex items-center justify-center p-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </div>
                                ) : (
                                  constituencies?.data?.map((constituency: any) => (
                                    <SelectItem key={constituency.id} value={constituency.id}>
                                      {constituency.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedConstituencyId && (
                        <FormField
                          control={form.control}
                          name="subConstituency"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Sub-Constituency</FormLabel>
                              <Popover open={subConstituencyOpen} onOpenChange={setSubConstituencyOpen}>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={subConstituencyOpen}
                                      className={cn(
                                        "w-full justify-between font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                      disabled={isLoadingSubConstituencies}
                                    >
                                      {isLoadingSubConstituencies ? (
                                        <span className="flex items-center gap-2">
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                          Loading...
                                        </span>
                                      ) : field.value ? (
                                        sortedSubConstituencies.find((sub: any) => sub.id === field.value)?.name
                                      ) : (
                                        "Search sub-constituency..."
                                      )}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                  <Command>
                                    <CommandInput placeholder="Search sub-constituency..." />
                                    <CommandList>
                                      <CommandEmpty>No sub-constituency found.</CommandEmpty>
                                      <CommandGroup>
                                        {sortedSubConstituencies.map((sub: any) => (
                                          <CommandItem
                                            key={sub.id}
                                            value={sub.name}
                                            onSelect={() => {
                                              field.onChange(sub.id)
                                              setSubConstituencyOpen(false)
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value === sub.id ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                            {sub.name}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <div className="flex gap-2">
                          <CountrySelector />
                          <FormControl>
                            <Input placeholder="54 123 4567" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode / ZIP (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Postcode / ZIP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN - Payment */}
              <div className="w-full lg:w-[450px] space-y-6">
                <Card className="border-0 shadow-lg ring-1 ring-black/5">
                  <CardHeader>
                    <CardTitle>Donation Summary</CardTitle>
                    <CardDescription>Select a cause and payment method</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    <FormField
                      control={form.control}
                      name="donationCause"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donation Cause</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Cause" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingCauses ? (
                                <div className="flex items-center justify-center p-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                              ) : (
                                donationCauses?.data?.map((cause: any) => (
                                  <SelectItem key={cause.id} value={cause.id}>
                                    {cause.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormLabel>Select a Payment Method</FormLabel>
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 gap-3"
                                >
                                  {/* Custom Card for Card Payment */}
                                  <FormItem>
                                    <FormControl>
                                      <div>
                                        <input type="radio" value="card" id="card" className="peer sr-only" {...form.register("paymentMethod")} />
                                        <label
                                          htmlFor="card"
                                          className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-accent/50 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                                              <CreditCard className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium">Card Payment</span>
                                          </div>
                                          <div className="flex -space-x-2">
                                            <div className="relative h-6 w-10">
                                              <Image src="/images/visa.png" alt="Visa" fill className="object-contain" />
                                            </div>
                                            <div className="relative h-6 w-10">
                                              <Image src="/images/master.png" alt="Mastercard" fill className="object-contain" />
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </FormControl>
                                  </FormItem>

                                  {/* Custom Card for Mobile Money */}
                                  <FormItem>
                                    <FormControl>
                                      <div>
                                        <input type="radio" value="mobile_money" id="mobile_money" className="peer sr-only" {...form.register("paymentMethod")} />
                                        <label
                                          htmlFor="mobile_money"
                                          className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-accent/50 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-yellow-50 p-2 text-yellow-600">
                                              <Smartphone className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium">Mobile Money</span>
                                          </div>
                                          <div className="flex -space-x-2">
                                            <div className="relative h-6 w-10">
                                              <Image src="/images/mtn.png" alt="MTN" fill className="object-contain" />
                                            </div>
                                            <div className="relative h-6 w-10">
                                              <Image src="/images/tcash.png" alt="Telecel" fill className="object-contain" />
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-medium">We accept these currencies</h3>
                      <div className="flex gap-2">
                        <div className="rounded-full border px-4 py-1 text-sm font-medium bg-white shadow-sm">GHS</div>
                        <div className="rounded-full border px-4 py-1 text-sm font-medium text-muted-foreground opacity-50">USD</div>
                        <div className="rounded-full border px-4 py-1 text-sm font-medium text-muted-foreground opacity-50">GBP</div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <FormLabel>Enter Amount</FormLabel>
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <AmountInput {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800 flex items-center gap-3 text-sm">
                      <Lock className="h-4 w-4" />
                      Payments are secured and encrypted.
                    </div>

                    <Button type="submit" disabled={initiateDonation.isPending} className="w-full text-lg h-12 shadow-lg shadow-primary/20">
                      {initiateDonation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ${form.watch("amount") ? `GHS ${Number(form.watch("amount")).toFixed(2)}` : ""}`
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <div className="text-center text-xs text-muted-foreground">
                  <p>Ghana International School &copy; {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
