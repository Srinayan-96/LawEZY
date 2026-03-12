"use client"

import { motion } from "framer-motion"
import { Shield, Clock, FileText, Users, Scale, AlertCircle } from "lucide-react"

const features = [
    {
        title: "AI Legal Assistant",
        description: "Instant answers to your legal queries, 24/7.",
        icon: <Scale className="h-6 w-6 text-white" />,
        className: "col-span-1 md:col-span-2 lg:col-span-1 bg-blue-600 text-white",
    },
    {
        title: "Verified Professionals",
        description: "Connect with 500+ pre-vetted attorneys.",
        icon: <Shield className="h-6 w-6 text-blue-600" />,
        className: "col-span-1 md:col-span-1 lg:col-span-1 bg-white border border-slate-200",
    },
    {
        title: "Document Repository",
        description: "Access thousands of legal templates.",
        icon: <FileText className="h-6 w-6 text-emerald-600" />,
        className: "col-span-1 md:col-span-1 lg:col-span-1 bg-white border border-slate-200",
    },
    {
        title: "Smart Scheduling",
        description: "Book consultations in seconds.",
        icon: <Clock className="h-6 w-6 text-purple-600" />,
        className: "col-span-1 md:col-span-2 lg:col-span-2 bg-slate-900 text-white",
    },
    {
        title: "Community Forum",
        description: "Discuss and share experiences.",
        icon: <Users className="h-6 w-6 text-indigo-600" />,
        className: "col-span-1 md:col-span-1 lg:col-span-1 bg-indigo-50 border border-indigo-100",
    },
    {
        title: "Urgent Support",
        description: "Emergency legal aid hotline.",
        icon: <AlertCircle className="h-6 w-6 text-red-600" />,
        className: "col-span-1 md:col-span-1 lg:col-span-1 bg-red-50 border border-red-100",
    }
]

export function BentoFeatures() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto p-4">
            {features.map((feature, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className={`${feature.className} p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 min-h-[200px]`}
                >
                    <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-sm">
                        {feature.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-sm opacity-80">{feature.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
