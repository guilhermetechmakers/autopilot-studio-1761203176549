import { ArrowRight, CheckCircle, Users, Zap, Shield, BarChart3, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "AI-Assisted Intake",
    description: "Automated lead qualification and proposal generation with AI-powered insights."
  },
  {
    icon: Zap,
    title: "One-Click Project Spin-up",
    description: "Instant project creation with repos, milestones, and client portals."
  },
  {
    icon: Users,
    title: "AI Copilot",
    description: "Intelligent assistance for specs, meeting minutes, and project management."
  },
  {
    icon: BarChart3,
    title: "Integrated Billing",
    description: "Seamless invoicing, QuickBooks sync, and profit analytics."
  },
  {
    icon: Clock,
    title: "Launch Orchestration",
    description: "Automated deployment, release notes, and stakeholder communications."
  },
  {
    icon: Shield,
    title: "Handover Packs",
    description: "One-click creation of final deliverables and SLA setup."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Agency Owner",
    company: "TechFlow Solutions",
    content: "Autopilot Studio transformed our client onboarding from weeks to hours. The AI copilot is like having a senior PM on every project.",
    avatar: "SC"
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Developer",
    company: "Independent",
    content: "The automated proposal generation and project spin-up saved me 20+ hours per client. Now I can focus on what I do best - building.",
    avatar: "MR"
  },
  {
    name: "Jennifer Kim",
    role: "Delivery Lead",
    company: "Digital Innovations",
    content: "The integrated billing and profit analytics gave us visibility we never had. We increased margins by 35% in the first quarter.",
    avatar: "JK"
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Sign In</Button>
              <Button className="btn-primary">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
            The Complete Business OS for
            <span className="text-primary"> AI Developers</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-secondary max-w-3xl mx-auto">
            Automate your entire client lifecycle from lead intake to project handover. 
            AI-powered proposals, one-click project spin-up, integrated billing, and intelligent project management.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" className="btn-primary">
              Book Intake Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Explore Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">Everything you need to scale your agency</h2>
            <p className="mt-4 text-lg text-text-secondary">
              From lead qualification to project delivery, we've got you covered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-hover">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">How it works</h2>
            <p className="mt-4 text-lg text-text-secondary">
              Four simple steps to transform your agency operations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Book Intake", description: "AI-powered qualification and proposal generation" },
              { step: "2", title: "Sign Contract", description: "E-sign integration with automated project creation" },
              { step: "3", title: "Deliver Projects", description: "AI copilot, task management, and client portal" },
              { step: "4", title: "Launch & Handover", description: "Automated deployment and handover pack creation" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">Trusted by agencies worldwide</h2>
            <p className="mt-4 text-lg text-text-secondary">
              See what our customers are saying
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{testimonial.name}</h4>
                      <p className="text-sm text-text-secondary">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-text-secondary">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-text-secondary">
              Choose the plan that fits your agency size
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "$99", description: "Perfect for solo developers", features: ["5 projects", "AI copilot", "Basic billing"] },
              { name: "Professional", price: "$299", description: "Ideal for small agencies", features: ["25 projects", "Advanced AI", "Full integrations"] },
              { name: "Enterprise", price: "Custom", description: "For large agencies", features: ["Unlimited projects", "Custom AI", "Dedicated support"] }
            ].map((plan, index) => (
              <Card key={index} className={`card-hover ${index === 1 ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-text-primary">{plan.price}</div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-positive" />
                        <span className="text-sm text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={index === 1 ? "default" : "outline"}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Ready to transform your agency?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/90">
            Join hundreds of agencies already using Autopilot Studio to scale their operations.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary">
              Book Intake Call
            </Button>
            <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
              </div>
              <p className="text-text-secondary">
                The complete business OS for AI developers and agencies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-4">Product</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-text-primary">Features</a></li>
                <li><a href="#" className="hover:text-text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-text-primary">Integrations</a></li>
                <li><a href="#" className="hover:text-text-primary">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-4">Company</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-text-primary">About</a></li>
                <li><a href="#" className="hover:text-text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-4">Support</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-text-primary">Status</a></li>
                <li><a href="#" className="hover:text-text-primary">Changelog</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-text-secondary">
            <p>&copy; 2024 Autopilot Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}