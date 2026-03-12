import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Calendar,
  FileText,
  BookOpen,
  Shield,
  Users,
  Star,
  ChevronRight,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white py-4 border-b border-border sticky top-0 z-50">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="LawEzy Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-crimson-deep">LawEzy</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#services"
                className="text-sm font-medium text-foreground hover:text-crimson-deep transition-colors"
              >
                Services
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium text-foreground hover:text-crimson-deep transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-foreground hover:text-crimson-deep transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-foreground hover:text-crimson-deep transition-colors"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="bg-crimson-deep hover:bg-crimson-deep/90">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-apricot to-apricot/70 -z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070')] bg-cover bg-center opacity-10 -z-10" />
        <div className="container px-4 md:px-6 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col space-y-6">
              <div className="inline-flex items-center rounded-full border border-crimson-deep/20 bg-crimson-deep/10 px-3 py-1 text-sm text-crimson-deep">
                <span className="font-medium">Connecting Legal Professionals & Clients</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-crimson-deep">
                Legal Solutions <br />
                <span className="text-foreground">Made Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
                Connect with experienced legal professionals, access resources, and get expert advice all in one place.
                Your legal journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Button asChild size="lg" className="bg-crimson-deep hover:bg-crimson-deep/90">
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#services">Explore Services</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <span className="font-medium">500+</span> legal professionals available
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-12 -right-12 h-64 w-64 bg-crimson-deep/10 rounded-full blur-3xl" />
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1169"
                  alt="Legal Consultation"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white font-bold text-xl mb-1">Expert Legal Advice</h3>
                  <p className="text-white/80 text-sm">Connect with professionals who understand your needs</p>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-apricot/40 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Our Mission */}
      <section className="py-16 md:py-24" id="mission">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-48 w-48 bg-apricot/40 rounded-full blur-2xl -z-10" />
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?q=80&w=1974"
                  alt="Our Mission"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 h-48 w-48 bg-crimson-deep/10 rounded-full blur-2xl -z-10" />
            </div>
            <div>
              <div className="inline-flex items-center rounded-full border border-crimson-deep/20 bg-crimson-deep/10 px-3 py-1 text-sm text-crimson-deep mb-6">
                <span className="font-medium">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">
                Making Legal Services <span className="text-crimson-deep">Accessible to All</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                At LawEzy, we believe everyone deserves access to quality legal services. Our mission is to bridge the
                gap between legal professionals and those in need of legal assistance through a user-friendly platform
                that simplifies the process of finding, connecting with, and engaging legal experts.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-crimson-deep/10 p-1.5 rounded-full text-crimson-deep">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Accessibility</h3>
                    <p className="text-muted-foreground">
                      Breaking down barriers to legal services through technology and innovation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-crimson-deep/10 p-1.5 rounded-full text-crimson-deep">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Transparency</h3>
                    <p className="text-muted-foreground">
                      Providing clear information about legal professionals, services, and costs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-crimson-deep/10 p-1.5 rounded-full text-crimson-deep">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Empowerment</h3>
                    <p className="text-muted-foreground">
                      Equipping individuals with knowledge and resources to navigate legal challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-muted/30" id="services">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <div className="inline-flex items-center rounded-full border border-crimson-deep/20 bg-crimson-deep/10 px-3 py-1 text-sm text-crimson-deep mb-4">
              <span className="font-medium">Our Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Comprehensive Legal Solutions for Every Need
            </h2>
            <p className="text-lg text-muted-foreground">
              LawEzy provides a wide range of services to connect you with legal professionals and resources tailored to
              your specific requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={<MessageSquare className="h-10 w-10 text-crimson-deep" />}
              title="Legal Consultations"
              description="Connect with experienced legal professionals for personalized advice on your specific situation."
            />
            <ServiceCard
              icon={<Calendar className="h-10 w-10 text-crimson-deep" />}
              title="Appointment Booking"
              description="Schedule online or in-person meetings with legal professionals at times that work for you."
            />
            <ServiceCard
              icon={<FileText className="h-10 w-10 text-crimson-deep" />}
              title="Document Access"
              description="Access a wide range of legal documents, templates, and resources for various legal matters."
            />
            <ServiceCard
              icon={<MessageSquare className="h-10 w-10 text-crimson-deep" />}
              title="AI Legal Assistant"
              description="Get instant answers to common legal questions through our AI-powered legal assistant."
            />
            <ServiceCard
              icon={<BookOpen className="h-10 w-10 text-crimson-deep" />}
              title="Legal Education"
              description="Stay informed with blogs, articles, and resources on various legal topics and developments."
            />
            <ServiceCard
              icon={<Users className="h-10 w-10 text-crimson-deep" />}
              title="Professional Network"
              description="Connect with a diverse network of legal professionals specializing in different areas of law."
            />
          </div>
        </div>
      </section>

      {/* Book Your Legal Service */}
      <section className="py-16 md:py-24" id="booking">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-crimson-deep/20 bg-crimson-deep/10 px-3 py-1 text-sm text-crimson-deep mb-6">
                <span className="font-medium">Book Your Legal Service</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">
                Simple Process, <span className="text-crimson-deep">Exceptional Service</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Booking a legal consultation has never been easier. Our streamlined process ensures you can connect with
                the right legal professional in just a few steps.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-crimson-deep flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Create Your Account</h3>
                    <p className="text-muted-foreground">
                      Sign up for LawEzy to access our full range of services and features.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-crimson-deep flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Find the Right Professional</h3>
                    <p className="text-muted-foreground">
                      Browse profiles, reviews, and specialties to find the perfect legal match.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-crimson-deep flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Schedule Your Consultation</h3>
                    <p className="text-muted-foreground">
                      Choose between online or in-person meetings at a time that works for you.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-crimson-deep flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Get Expert Legal Assistance</h3>
                    <p className="text-muted-foreground">
                      Connect with your legal professional and receive the guidance you need.
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild className="mt-8 bg-crimson-deep hover:bg-crimson-deep/90">
                <Link href="/signup">
                  Book Your Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -right-6 h-48 w-48 bg-crimson-deep/10 rounded-full blur-2xl -z-10" />
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974"
                  alt="Book Consultation"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 h-48 w-48 bg-apricot/40 rounded-full blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-apricot/30 to-background" id="features">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <div className="inline-flex items-center rounded-full border border-crimson-deep/20 bg-crimson-deep/10 px-3 py-1 text-sm text-crimson-deep mb-4">
              <span className="font-medium">Platform Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              Powerful Tools for Your <span className="text-crimson-deep">Legal Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              LawEzy combines innovative technology with legal expertise to provide a comprehensive platform for all
              your legal needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="bg-crimson-deep/10 p-3 rounded-full w-fit mb-4">
                <MessageSquare className="h-6 w-6 text-crimson-deep" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Legal Assistant</h3>
              <p className="text-muted-foreground mb-4">
                Get instant answers to common legal questions with our AI-powered assistant available 24/7.
              </p>
              <Link href="#" className="text-crimson-deep font-medium inline-flex items-center hover:underline">
                Learn more
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="bg-crimson-deep/10 p-3 rounded-full w-fit mb-4">
                <Calendar className="h-6 w-6 text-crimson-deep" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-muted-foreground mb-4">
                Book appointments with legal professionals based on availability, specialty, and location.
              </p>
              <Link href="#" className="text-crimson-deep font-medium inline-flex items-center hover:underline">
                Learn more
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="bg-crimson-deep/10 p-3 rounded-full w-fit mb-4">
                <FileText className="h-6 w-6 text-crimson-deep" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Repository</h3>
              <p className="text-muted-foreground mb-4">
                Access, download, and share legal documents, templates, and resources securely.
              </p>
              <Link href="#" className="text-crimson-deep font-medium inline-flex items-center hover:underline">
                Learn more
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="bg-crimson-deep/10 p-3 rounded-full w-fit mb-4">
                <MessageSquare className="h-6 w-6 text-crimson-deep" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
              <p className="text-muted-foreground mb-4">
                Communicate directly with legal professionals through our encrypted messaging system.
              </p>
              <Link href="#" className="text-crimson-deep font-medium inline-flex items-center hover:underline">
                Learn more
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="bg-crimson-deep/10 p-3 rounded-full w-fit mb-4">
                <BookOpen className="h-6 w-6 text-crimson-deep" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Knowledge Base</h3>
              <p className="text-muted-foreground mb-4">
                Stay informed with blogs, articles, and resources on various legal topics and developments.
              </p>
              <Link href="#" className="text-crimson-deep font-medium inline-flex items-center hover:underline">
                Learn more
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="bg-crimson-deep/10 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-crimson-deep" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy Protection</h3>
              <p className="text-muted-foreground mb-4">
                Your data is secure with our advanced encryption and privacy-focused design.
              </p>
              <Link href="#" className="text-crimson-deep font-medium inline-flex items-center hover:underline">
                Learn more
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30" id="testimonials">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <div className="inline-flex items-center rounded-full border border-crimson-deep/20 bg-crimson-deep/10 px-3 py-1 text-sm text-crimson-deep mb-4">
              <span className="font-medium">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
              What Our <span className="text-crimson-deep">Clients Say</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from individuals and businesses who have found legal solutions through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Small Business Owner"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              quote="LawEzy made it incredibly easy to find a business attorney. The booking process was seamless, and I received expert advice that helped me navigate a complex contract negotiation."
              rating={5}
            />
            <TestimonialCard
              name="Michael Chen"
              role="Real Estate Investor"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              quote="As someone who deals with multiple property transactions, having access to legal professionals through LawEzy has been invaluable. The platform is intuitive and the professionals are top-notch."
              rating={5}
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Family Law Attorney"
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"
              quote="From the professional side, LawEzy has helped me connect with clients who truly need my expertise. The platform handles scheduling and initial consultations, allowing me to focus on providing legal assistance."
              rating={5}
            />
            <TestimonialCard
              name="David Thompson"
              role="Individual Client"
              image="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
              quote="I needed help with estate planning and was overwhelmed by the process. LawEzy connected me with an attorney who explained everything clearly and helped me create a comprehensive plan."
              rating={4}
            />
            <TestimonialCard
              name="Jennifer Lee"
              role="HR Director"
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              quote="Our company uses LawEzy to access employment law resources and occasional consultations. The AI assistant is surprisingly helpful for quick questions, and the document repository saves us time."
              rating={5}
            />
            <TestimonialCard
              name="Robert Wilson"
              role="Corporate Lawyer"
              image="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150"
              quote="The platform has streamlined my practice and expanded my client base. The scheduling tools and secure messaging features make client communication efficient and professional."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-crimson-deep text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                Ready to Simplify Your Legal Journey?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of individuals and businesses who have found the right legal support through LawEzy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-crimson-deep hover:bg-white/90">
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">Satisfaction Guaranteed</h3>
                    <p className="text-white/80">We're committed to your legal success</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white/80" />
                    <span>Access to 500+ verified legal professionals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white/80" />
                    <span>Secure and confidential consultations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white/80" />
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white/80" />
                    <span>24/7 access to resources and AI assistance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-apricot py-12 md:py-16" id="contact">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/images/logo.png" alt="LawEzy Logo" className="h-8 w-auto" />
                <span className="text-xl font-bold text-crimson-deep">LawEzy</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Connecting legal professionals with those in need of legal assistance through an innovative platform.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-crimson-deep">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    Legal Consultations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    Document Access
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    AI Legal Assistant
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    Appointment Booking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    Legal Education
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-crimson-deep">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-crimson-deep">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-muted-foreground">info@lawezy.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-muted-foreground">+91 98765 43210</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-muted-foreground">
                    123 Legal Street, Suite 100
                    <br />
                    New Delhi, 110001
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-crimson-deep/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} LawEzy. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-crimson-deep transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-fore ground">{description}</p>
    </div>
  )
}

function TestimonialCard({
  name,
  role,
  image,
  quote,
  rating,
}: {
  name: string
  role: string
  image: string
  quote: string
  rating: number
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-4 italic">"{quote}"</p>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    </div>
  )
}
