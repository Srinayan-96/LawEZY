import { cn } from "@/lib/utils"
import { User, Bot } from "lucide-react"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export function ChatMessage({ message }: { message: Message }) {
    return (
        <div
            className={cn(
                "flex w-full gap-2",
                message.role === "user" ? "justify-end" : "justify-start"
            )}
        >
            {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                </div>
            )}
            <div
                className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted/80 dark:bg-muted/50 backdrop-blur-sm rounded-tl-none border border-border/50"
                )}
            >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
            {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-secondary-foreground" />
                </div>
            )}
        </div>
    )
}
