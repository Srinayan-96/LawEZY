import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { HeroSlider } from "@/components/landing/hero-slider"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
        <HeroSlider />

        {/* Features Grid */}
        <section className="py-24 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Built for modern legal workflows
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Everything you need to manage legal processes effectively.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Icons.shield,
                  title: "Secure & Confidential",
                  description: "Bank-grade encryption ensures your sensitive documents and conversations remain private.",
                },
                {
                  icon: Icons.zap,
                  title: "AI-Powered Insights",
                  description: "Leverage our advanced AI to analyze contracts and get instant answers to legal queries.",
                },
                {
                  icon: Icons.users,
                  title: "Expert Network",
                  description: "Access a curated network of verified legal professionals specializing in various fields.",
                },
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900/50">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-indigo-600 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-indigo-600 opacity-20 blur-3xl"></div>

          <div className="container relative mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to transform your legal experience?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              Join thousands of individuals and businesses who trust LawEzy for their legal needs.
            </p>
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-slate-900 hover:bg-slate-100 font-semibold" asChild>
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
