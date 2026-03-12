import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-16 px-4 border-t border-slate-900">
            <div className="container max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">LawEzy</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Press</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Services</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-white transition">Find a Lawyer</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Legal Documents</Link></li>
                        <li><Link href="#" className="hover:text-white transition">AI Assistant</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
                        <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
                    <p className="text-sm mb-4">Sign up for our newsletter</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Email address" className="bg-slate-900 border-none rounded px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-blue-600" />
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500">Go</Button>
                    </div>
                </div>
            </div>
            <div className="container max-w-7xl mx-auto pt-8 border-t border-slate-900 text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <span>© {new Date().getFullYear()} LawEzy. All rights reserved.</span>
                <div className="flex gap-4">
                    <Link href="#" className="hover:text-white transition">Privacy</Link>
                    <Link href="#" className="hover:text-white transition">Legal</Link>
                    <Link href="#" className="hover:text-white transition">Sitemap</Link>
                </div>
            </div>
        </footer>
    )
}
