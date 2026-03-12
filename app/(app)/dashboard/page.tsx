"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"

export default function DashboardPage() {
    const { user } = useAuth()

    const projects = [
        {
            title: "Corporate Litigation Q1",
            description: "Analysis of ongoing corporate disputes and settlement strategies.",
            updated: "2 mins ago",
            tags: ["Litigation", "Corporate"],
            color: "bg-blue-500",
        },
        {
            title: "IP Rights Assessment",
            description: "Review of patent portfolio and potential infringement cases.",
            updated: "2 hours ago",
            tags: ["Intellectual Property", "Review"],
            color: "bg-purple-500",
        },
        {
            title: "Employee Contracts 2024",
            description: "Drafting and review of standard employment agreements.",
            updated: "1 day ago",
            tags: ["Employment", "Contracts"],
            color: "bg-green-500",
        },
        {
            title: "Merger Due Diligence",
            description: "Comprehensive risk assessment for the upcoming merger.",
            updated: "3 days ago",
            tags: ["M&A", "Due Diligence"],
            color: "bg-orange-500",
        },
    ]

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.displayName?.split(" ")[0] || "User"}. Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button>
                        <Icons.add className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card dark:glass-card-dark">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Icons.projects className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                </Card>
                <Card className="glass-card dark:glass-card-dark">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                        <Icons.users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">+4 new this week</p>
                    </CardContent>
                </Card>
                <Card className="glass-card dark:glass-card-dark">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hours Tracked</CardTitle>
                        <Icons.clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142.5</div>
                        <p className="text-xs text-muted-foreground">+12% from last week</p>
                    </CardContent>
                </Card>
                <Card className="glass-card dark:glass-card-dark">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                        <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">3 high priority</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Recent Projects</h3>
                        <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {projects.map((project, i) => (
                            <Card key={i} className="group overflow-hidden transition-all hover:shadow-lg border-slate-200 dark:border-slate-800">
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-10 h-10 rounded-lg ${project.color} bg-opacity-10 flex items-center justify-center text-white mb-2`}>
                                            <Icons.projects className={`text-opacity-100 ${project.color.replace('bg-', 'text-')}`} />
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Icons.moreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-base font-semibold">{project.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 text-xs mt-1">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-400/10 dark:text-slate-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-muted-foreground">
                                    <span>Updated {project.updated}</span>
                                    <div className="flex -space-x-2 overflow-hidden">
                                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gray-200" />
                                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gray-300" />
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="col-span-3">
                    <h3 className="text-lg font-medium mb-4">Activity Feed</h3>
                    <Card className="h-full border-slate-200 dark:border-slate-800">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="relative mt-1">
                                            <div className="absolute -left-0.5 top-0 h-full w-0.5 bg-slate-200 dark:bg-slate-800" />
                                            <div className="relative flex h-2 w-2 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-950" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                                                Project updated
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Sarah modified <span className="font-medium text-slate-700 dark:text-slate-300">Contract #23</span>
                                            </p>
                                            <span className="text-[10px] text-muted-foreground">2 hours ago</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
