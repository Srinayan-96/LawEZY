"use client"

import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"

const LOGOS = [
    "Microsoft", "Google", "Amazon", "Uber", "Airbnb", "Stripe", "Zoom", "Slack"
    // In a real app, these would be actual logo text/SVGs
]

export function TrustMarquee() {
    const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
        Autoplay({ delay: 0, stopOnInteraction: false, playOnInit: true })
    ])

    // Custom CSS for smooth linear scrolling would be better, but Embla works too
    // Actually, for a linear marquee, CSS is often smoother. 
    // But let's use Embla as requested in plan or simple CSS marquee.
    // Converting to simple CSS marquee for better "infinite" feel without js jank.

    return (
        <div className="w-full py-12 bg-slate-50 border-y border-slate-200 overflow-hidden">
            <div className="container px-4 text-center mb-8">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Trusted by innovative companies</p>
            </div>
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
                    {/* Duplicate list to ensure seamless loop */}
                    {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                        <span key={i} className="text-2xl font-bold text-slate-300 mx-4">{logo}</span>
                    ))}
                </div>

                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-16 items-center">
                    {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                        <span key={i} className="text-2xl font-bold text-slate-300 mx-4">{logo}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
