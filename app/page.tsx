"use client"

import * as React from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Lock, CreditCard, Smartphone } from "lucide-react"

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
import { CountrySelector } from "@/components/CountrySelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Header } from "@/components/Header"
import { AmountInput } from "@/components/AmountInput"

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
      currency: "GHS",
      amount: "",
      donationCause: undefined,
      paymentMethod: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would handle the payment logic
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
                              <SelectItem value="annual-fund">Annual Fund 2026</SelectItem>
                              <SelectItem value="scholarship">Scholarship Fund</SelectItem>
                              <SelectItem value="infrastructure">Infrastructure Development</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="constituency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Constituency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Constituency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="alumni">Alumni</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="friend">Friend of GIS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                              <SelectItem value="general">General Support</SelectItem>
                              <SelectItem value="library">Library Fund</SelectItem>
                              <SelectItem value="sports">Sports Center</SelectItem>
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

                    <Button type="submit" className="w-full text-lg h-12 shadow-lg shadow-primary/20">
                      Pay {form.watch("amount") ? `GHS ${Number(form.watch("amount")).toFixed(2)}` : ""}
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
