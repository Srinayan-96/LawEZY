"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight } from "lucide-react"

const SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070",
        title: "Legal Solutions Made Simple",
        subtitle: "Connect with top-tier legal professionals for your business and personal needs.",
    },
    {
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069",
        title: "Expert Advice, On Demand",
        subtitle: "Get instant answers and schedule consultations with verified experts.",
    },
    {
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071",
        title: "Empowering Your Rights",
        subtitle: "Accessible legal resources and transparent pricing for everyone.",
    },
]

export function HeroSlider() {
    const [emblaRef] = useEmblaCarousel({ loop: true, duration: 40 }, [Autoplay({ delay: 5000 })])

    return (
        <div className="relative h-[80vh] w-full overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/20 to-transparent" />

            <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container h-full flex">
                    {SLIDES.map((slide, index) => (
                        <div key={index} className="embla__slide relative h-full flex-[0_0_100%] min-w-0">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-slate-900/30" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="container px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto space-y-6"
                    >
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            <span className="font-medium">500+ Professionals Online Now</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                            Find the Right <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Legal Help</span>
                        </h1>

                        <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            LawEzy connects you with verified attorneys and consultants.
                            Modern legal services for the digital age.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <div className="relative group w-full max-w-md">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center bg-white rounded-lg p-2 shadow-2xl">
                                    <Search className="h-5 w-5 text-muted-foreground ml-2" />
                                    <input
                                        type="text"
                                        placeholder="I need help with..."
                                        className="flex-1 border-none focus:ring-0 text-foreground bg-transparent px-4 py-2 outline-none"
                                    />
                                    <Button className="rounded-md bg-slate-900 text-white hover:bg-slate-800">
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex items-center justify-center gap-8 text-white/60 text-sm">
                            <span>Verified Professionals</span>
                            <span>•</span>
                            <span>Secure Payments</span>
                            <span>•</span>
                            <span>24/7 Support</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
