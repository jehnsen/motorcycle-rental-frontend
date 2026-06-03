import Link from "next/link";
import { ArrowRight, Search, CreditCard, Key, Shield, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Find Your Perfect Ride",
    description: "Browse hundreds of motorcycles from verified agencies across Metro Manila, Cebu, and Baguio. Use filters to find exactly what you need — by type, price, availability, and more.",
    details: ["Filter by location, bike type, and daily rate", "See real-time availability", "Read verified reviews from past renters", "Compare fleets from multiple agencies"],
  },
  {
    step: "02",
    icon: CreditCard,
    title: "Book & Pay Securely",
    description: "Reserve your bike in minutes directly through the platform. Pay via GCash, Maya, or arrange cash on pickup. A refundable security deposit is collected to protect both parties.",
    details: ["Instant booking confirmation", "GCash, Maya, or cash accepted", "Refundable security deposit", "24-hour cancellation policy"],
  },
  {
    step: "03",
    icon: Key,
    title: "Pick Up & Ride",
    description: "Head to the agency on your booking date with your license and valid ID. After a quick safety rundown and inspection walkthrough, the keys are yours. Hit the open road.",
    details: ["Present your license and ID", "Complete a short safety briefing", "Inspect the bike together", "Ride with full agency support"],
  },
];

const faqs = [
  {
    q: "What documents do I need to rent?",
    a: "A valid Philippine driver's license (or international license) and one government-issued ID. Some agencies may require 2 years of riding experience for big bikes.",
  },
  {
    q: "What is the security deposit?",
    a: "Each bike has a security deposit ranging from ₱2,000–₱5,000 depending on the bike class. This is fully refundable upon safe return.",
  },
  {
    q: "Can I rent for multiple days?",
    a: "Yes! Most agencies offer discounts for week-long rentals. Use the date picker in the booking widget to see your total price.",
  },
  {
    q: "What happens if the bike breaks down?",
    a: "All verified agencies provide roadside support contact. Minor breakdowns are covered. Report issues immediately — agencies have protocols in place.",
  },
  {
    q: "Is insurance included?",
    a: "Bikes are registered with CTPL insurance. For additional coverage, inquire with the specific agency about extended protection options.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container py-16 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand mb-6">
          Simple. Fast. Verified.
        </div>
        <h1 className="text-5xl font-black mb-4">How RentNRide_PH Works</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          From zero to throttle in three steps. No paperwork nightmare, no shady deals — just you and the open road.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-12 mb-20">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-brand" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand uppercase tracking-widest">Step {step.step}</p>
                    <h2 className="text-2xl font-black">{step.title}</h2>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 space-y-4">
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              {i < steps.length - 1 && <div className="md:col-span-5"><Separator /></div>}
            </div>
          );
        })}
      </div>

      {/* Trust signals */}
      <div className="rounded-2xl border border-border bg-surface p-8 mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">Why renters trust us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Verified agencies only", desc: "Every agency passes our vetting process before listing." },
            { icon: Star, title: "Transparent reviews", desc: "Only renters who completed a booking can leave a review." },
            { icon: Clock, title: "Fast support", desc: "Issues? Our team responds within 2 hours on weekdays." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-16">
        <h2 className="text-3xl font-black mb-8">Frequently asked questions</h2>
        <div className="space-y-0 divide-y divide-border rounded-xl border border-border bg-surface overflow-hidden">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black">Ready to ride?</h2>
        <p className="text-muted-foreground">Browse available bikes and book your next adventure today.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild className="gap-2 text-base font-bold">
            <Link href="/browse">Browse bikes <ArrowRight className="h-5 w-5" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/agencies">View agencies</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
