import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, limit } from "firebase/firestore"

// Mock "Knowledge Base" (simulated web scraping of the site itself)
const SITE_KNOWLEDGE = {
    about: "LawEzy is a platform connecting legal professionals with clients. Our mission is to make legal services accessible, transparent, and empowering for everyone.",
    services: "We offer Legal Consultations, Appointment Booking, Document Access, AI Legal Assistant, and a comprehensive Professional Network.",
    contact: "You can reach us at info@lawezy.com or +91 98765 43210. Our office is located at 123 Legal Street, Suite 100, New Delhi.",
    pricing: "Our platform helps you find professionals within your budget. Registration is free for users. Professionals may have their own consultation rates.",
}

export async function POST(req: Request) {
    try {
        const { message } = await req.json()
        const lowerMessage = message.toLowerCase()

        // 1. Intent: Find a Professional
        if (
            lowerMessage.includes("lawyer") ||
            lowerMessage.includes("attorney") ||
            lowerMessage.includes("consultant") ||
            lowerMessage.includes("professional") ||
            lowerMessage.includes("find") ||
            lowerMessage.includes("search")
        ) {
            // Simulate "Database Scraping"
            // In a real app, we'd use more advanced search (Algolia/Elastic) or vector embeddings
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "professional"),
                    limit(5)
                )
                const querySnapshot = await getDocs(q)

                const professionals = querySnapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        name: data.name || "Legal Professional",
                        specialty: data.specialty || "General Practice",
                        rate: data.rate || "N/A"
                    }
                })

                if (professionals.length > 0) {
                    const proList = professionals.map(p => `- **${p.name}** (${p.specialty}): ₹${p.rate}/hr`).join("\n")
                    return NextResponse.json({
                        response: `I found some legal professionals who might be able to help you:\n\n${proList}\n\nWould you like to book a consultation with any of them?`,
                        type: "results",
                        data: professionals
                    })
                } else {
                    return NextResponse.json({
                        response: "I couldn't find any professionals matching that criteria right now. However, our network is growing every day. You can try browsing the 'Services' section.",
                        type: "text"
                    })
                }
            } catch (dbError) {
                console.error("Database query error:", dbError)
                return NextResponse.json({
                    response: "I'm having trouble connecting to our professional directory at the moment. Please try again later.",
                    type: "error"
                })
            }
        }

        // 2. Intent: Site Information (Simulated Scraping)
        if (lowerMessage.includes("mission") || lowerMessage.includes("what is")) {
            return NextResponse.json({ response: SITE_KNOWLEDGE.about, type: "text" })
        }
        if (lowerMessage.includes("service") || lowerMessage.includes("offer")) {
            return NextResponse.json({ response: SITE_KNOWLEDGE.services, type: "text" })
        }
        if (lowerMessage.includes("contact") || lowerMessage.includes("email") || lowerMessage.includes("phone") || lowerMessage.includes("address")) {
            return NextResponse.json({ response: SITE_KNOWLEDGE.contact, type: "text" })
        }
        if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("free")) {
            return NextResponse.json({ response: SITE_KNOWLEDGE.pricing, type: "text" })
        }


        // 3. Default "AI" Response (Rule-based falback)
        return NextResponse.json({
            response: "I can help you find legal professionals, answer questions about LawEzy's services, or provide contact information. Try asking 'Find me a lawyer' or 'What services do you offer?'.",
            type: "text"
        })

    } catch (error) {
        console.error("AI Chat API Error:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
