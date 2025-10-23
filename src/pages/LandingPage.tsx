import { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Zap, 
  Shield, 
  BarChart3, 
  FileText,
  Calendar,
  Globe,
  Star,
  Play,
  ChevronRight,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Award,
  Target,
  Rocket,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { useScrollPosition } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

// Enhanced features with more detail
const features = [
  {
    icon: FileText,
    title: "AI-Assisted Intake",
    description: "Automated lead qualification and proposal generation with AI-powered insights and scoring.",
    benefits: ["Qualification scoring", "Auto-proposal generation", "Calendar integration"]
  },
  {
    icon: Zap,
    title: "One-Click Project Spin-up",
    description: "Instant project creation with repos, milestones, client portals, and team invitations.",
    benefits: ["Repository setup", "Milestone creation", "Client portal access"]
  },
  {
    icon: Brain,
    title: "AI Copilot",
    description: "Intelligent assistance for specs, meeting minutes, project management, and decision support.",
    benefits: ["Spec generation", "Meeting transcription", "Task automation"]
  },
  {
    icon: BarChart3,
    title: "Integrated Billing",
    description: "Seamless invoicing, QuickBooks sync, profit analytics, and financial reporting.",
    benefits: ["Automated invoicing", "QuickBooks sync", "Profit tracking"]
  },
  {
    icon: Rocket,
    title: "Launch Orchestration",
    description: "Automated deployment, release notes, stakeholder communications, and rollback management.",
    benefits: ["Deploy automation", "Release notes", "Stakeholder updates"]
  },
  {
    icon: Shield,
    title: "Handover Packs",
    description: "One-click creation of final deliverables, SLA setup, and post-launch support automation.",
    benefits: ["Document assembly", "SLA configuration", "Support automation"]
  }
];

// Enhanced testimonials with more social proof
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Agency Owner",
    company: "TechFlow Solutions",
    content: "Autopilot Studio transformed our client onboarding from weeks to hours. The AI copilot is like having a senior PM on every project.",
    avatar: "SC",
    rating: 5,
    verified: true
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Developer",
    company: "Independent",
    content: "The automated proposal generation and project spin-up saved me 20+ hours per client. Now I can focus on what I do best - building.",
    avatar: "MR",
    rating: 5,
    verified: true
  },
  {
    name: "Jennifer Kim",
    role: "Delivery Lead",
    company: "Digital Innovations",
    content: "The integrated billing and profit analytics gave us visibility we never had. We increased margins by 35% in the first quarter.",
    avatar: "JK",
    rating: 5,
    verified: true
  },
  {
    name: "David Park",
    role: "CTO",
    company: "ScaleUp Agency",
    content: "The launch orchestration feature alone paid for itself in the first month. Deployments that used to take days now happen in minutes.",
    avatar: "DP",
    rating: 5,
    verified: true
  },
  {
    name: "Lisa Thompson",
    role: "Project Manager",
    company: "Creative Collective",
    content: "The AI copilot's meeting transcription and action item generation has revolutionized our project management. Nothing falls through the cracks anymore.",
    avatar: "LT",
    rating: 5,
    verified: true
  },
  {
    name: "Alex Kumar",
    role: "Founder",
    company: "DevOps Pro",
    content: "From intake to handover, Autopilot Studio handles everything. Our client satisfaction scores have never been higher.",
    avatar: "AK",
    rating: 5,
    verified: true
  }
];

// Customer logos (placeholder for now)
const customerLogos = [
  "TechFlow Solutions",
  "Digital Innovations", 
  "ScaleUp Agency",
  "Creative Collective",
  "DevOps Pro",
  "CloudFirst"
];

// Enhanced pricing plans
const pricingPlans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for solo developers and small teams",
    features: [
      "Up to 5 active projects",
      "AI copilot assistance",
      "Basic billing integration",
      "Email support",
      "Standard templates"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    price: "$299",
    period: "/month",
    description: "Ideal for growing agencies and teams",
    features: [
      "Up to 25 active projects",
      "Advanced AI features",
      "Full integrations (QuickBooks, GitHub, etc.)",
      "Priority support",
      "Custom templates",
      "Team collaboration tools",
      "Advanced analytics"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large agencies with complex needs",
    features: [
      "Unlimited projects",
      "Custom AI training",
      "Dedicated support",
      "Custom integrations",
      "White-label options",
      "Advanced security",
      "SLA guarantees"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

// How it works steps with more detail
const howItWorksSteps = [
  {
    step: "1",
    title: "Book Intake",
    description: "AI-powered qualification and proposal generation",
    details: "Schedule a call, fill out our intelligent intake form, and our AI analyzes your project requirements to generate a tailored proposal.",
    icon: Calendar
  },
  {
    step: "2", 
    title: "Sign Contract",
    description: "E-sign integration with automated project creation",
    details: "Review and sign contracts digitally. Once signed, we automatically create your project workspace, milestones, and client portal.",
    icon: FileText
  },
  {
    step: "3",
    title: "Deliver Projects", 
    description: "AI copilot, task management, and client portal",
    details: "Use our AI copilot for specs and meeting minutes, manage tasks with our kanban board, and keep clients updated through their portal.",
    icon: Target
  },
  {
    step: "4",
    title: "Launch & Handover",
    description: "Automated deployment and handover pack creation",
    details: "Deploy with one click, generate release notes automatically, and create comprehensive handover packs for seamless project completion.",
    icon: Rocket
  }
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 50;

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with scroll effects */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors">How it Works</a>
              <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
              <a href="#testimonials" className="text-text-secondary hover:text-text-primary transition-colors">Testimonials</a>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
              <Button className="btn-primary group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
              <nav className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-text-secondary hover:text-text-primary transition-colors">Features</a>
                <a href="#how-it-works" className="block text-text-secondary hover:text-text-primary transition-colors">How it Works</a>
                <a href="#pricing" className="block text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
                <a href="#testimonials" className="block text-text-secondary hover:text-text-primary transition-colors">Testimonials</a>
                <div className="pt-4 border-t border-border">
                  <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Hero Section with animated gradient background */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full float-animation" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-lg rotate-45 float-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-chart-orange/20 rounded-full float-animation" style={{ animationDelay: '2s' }}></div>

        <div className="relative mx-auto max-w-7xl text-center">
          <ScrollAnimation animation="fade-in-up" delay={0}>
            <h1 className="hero-title text-4xl font-bold tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
              The Complete Business OS for
              <span className="gradient-text"> AI Developers</span>
            </h1>
          </ScrollAnimation>
          
          <ScrollAnimation animation="fade-in-up" delay={0.2}>
            <p className="hero-subtitle mt-6 text-lg leading-8 text-text-secondary max-w-3xl mx-auto">
              Automate your entire client lifecycle from lead intake to project handover. 
              AI-powered proposals, one-click project spin-up, integrated billing, and intelligent project management.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation animation="fade-in-up" delay={0.4}>
            <div className="cta-buttons mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="btn-primary group text-lg px-8 py-4 pulse-glow">
                Book Intake Call
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 group hover-lift">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
          </ScrollAnimation>

          {/* Social proof indicators */}
          <ScrollAnimation animation="fade-in-up" delay={0.6}>
            <div className="mt-16">
              <p className="text-sm text-text-secondary mb-4">Trusted by 500+ agencies worldwide</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                {customerLogos.slice(0, 4).map((logo, index) => (
                  <div key={index} className="text-sm font-medium text-text-secondary">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Enhanced Features Grid with better animations */}
      <section id="features" className="section-padding py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <ScrollAnimation animation="fade-in-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Everything you need to scale your agency</h2>
              <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                From lead qualification to project delivery, we've got you covered with AI-powered automation.
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <ScrollAnimation 
                  key={index} 
                  animation="fade-in-up" 
                  delay={index * 0.1}
                >
                  <Card className="card-hover group hover-lift">
                    <CardHeader className="card-mobile">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="card-mobile">
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-2 text-sm text-text-secondary">
                            <CheckCircle className="h-4 w-4 text-positive flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works with better visual flow */}
      <section id="how-it-works" className="section-padding py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <ScrollAnimation animation="fade-in-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">How it works</h2>
              <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                Four simple steps to transform your agency operations with AI-powered automation
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollAnimation 
                  key={index} 
                  animation="fade-in-up" 
                  delay={index * 0.2}
                >
                  <div className="text-center group relative">
                    <div className="relative mb-6">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                        <Icon className="h-4 w-4 text-accent-foreground" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-text-secondary mb-4">{item.description}</p>
                    <p className="text-sm text-text-secondary/80">{item.details}</p>
                    
                    {/* Connection line for desktop */}
                    {index < howItWorksSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform translate-x-4"></div>
                    )}
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials with more social proof */}
      <section id="testimonials" className="section-padding py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <ScrollAnimation animation="fade-in-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Trusted by agencies worldwide</h2>
              <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                See what our customers are saying about their transformation
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimation 
                key={index} 
                animation="fade-in-up" 
                delay={index * 0.1}
              >
                <Card className="card-hover group hover-lift">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-primary font-semibold">{testimonial.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-text-primary">{testimonial.name}</h4>
                          {testimonial.verified && (
                            <Award className="h-4 w-4 text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">{testimonial.role}, {testimonial.company}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-chart-orange text-chart-orange" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-text-secondary italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>

          {/* Additional social proof */}
          <ScrollAnimation animation="fade-in-up" delay={0.6}>
            <div className="mt-16 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-text-secondary">Agencies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">$2M+</div>
                  <div className="text-sm text-text-secondary">Revenue Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-orange">95%</div>
                  <div className="text-sm text-text-secondary">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-blue">50%</div>
                  <div className="text-sm text-text-secondary">Time Saved</div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Enhanced Pricing with better visual hierarchy */}
      <section id="pricing" className="section-padding py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <ScrollAnimation animation="fade-in-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">Simple, transparent pricing</h2>
              <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
                Choose the plan that fits your agency size. All plans include a 14-day free trial.
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <ScrollAnimation 
                key={index} 
                animation="fade-in-up" 
                delay={index * 0.1}
              >
                <Card 
                  className={cn(
                    "card-hover group relative",
                    plan.popular && "ring-2 ring-primary shadow-lg scale-105"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                      <span className="text-text-secondary">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-positive flex-shrink-0" />
                          <span className="text-text-secondary">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={cn(
                        "w-full group",
                        plan.popular ? "btn-primary" : "btn-secondary"
                      )}
                    >
                      {plan.cta}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>

          {/* Enterprise CTA */}
          <ScrollAnimation animation="fade-in-up" delay={0.4}>
            <div className="mt-16 text-center">
              <p className="text-text-secondary mb-4">Need something custom?</p>
              <Button variant="outline" size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Enhanced CTA Section with gradient background */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative mx-auto max-w-4xl text-center">
          <ScrollAnimation animation="fade-in-up">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to transform your agency?
            </h2>
          </ScrollAnimation>
          
          <ScrollAnimation animation="fade-in-up" delay={0.2}>
            <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join hundreds of agencies already using Autopilot Studio to scale their operations and increase profitability.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation animation="fade-in-up" delay={0.4}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 group">
                <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Book Intake Call
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary group">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
            </div>
          </ScrollAnimation>

          {/* Trust indicators */}
          <ScrollAnimation animation="fade-in-up" delay={0.6}>
            <div className="mt-12">
              <p className="text-primary-foreground/80 text-sm mb-4">14-day free trial • No credit card required • Cancel anytime</p>
              <div className="flex items-center justify-center gap-8 text-primary-foreground/60">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Enhanced Footer with more comprehensive links */}
      <footer className="border-t border-border py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <ScrollAnimation animation="fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">A</span>
                  </div>
                  <span className="text-xl font-semibold text-text-primary">Autopilot Studio</span>
                </div>
                <p className="text-text-secondary mb-6 max-w-md">
                  The complete business OS for AI developers and agencies. Automate your entire client lifecycle from lead intake to project handover.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Github className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Product */}
              <div>
                <h3 className="font-semibold text-text-primary mb-4">Product</h3>
                <ul className="space-y-3 text-text-secondary">
                  <li><a href="#features" className="hover:text-text-primary transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Integrations</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Changelog</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold text-text-primary mb-4">Company</h3>
                <ul className="space-y-3 text-text-secondary">
                  <li><a href="#" className="hover:text-text-primary transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Press</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-text-primary mb-4">Support</h3>
                <ul className="space-y-3 text-text-secondary">
                  <li><a href="#" className="hover:text-text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Status</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-text-primary transition-colors">Contact Support</a></li>
                </ul>
              </div>
            </div>
          </ScrollAnimation>

          {/* Bottom section */}
          <ScrollAnimation animation="fade-in-up" delay={0.2}>
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-text-secondary text-sm">
                  &copy; 2024 Autopilot Studio. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm text-text-secondary">
                  <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-text-primary transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </footer>
    </div>
  );
}