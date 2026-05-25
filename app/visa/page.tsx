import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Clock, AlertCircle, Globe, CreditCard, BookOpen, Plane } from "lucide-react"

const countries = [
  {
    name: "Canada",
    flag: "🇨🇦",
    visaType: "Study Permit",
    processingTime: "8–12 weeks",
    fee: "CAD 150",
    steps: [
      "Receive Letter of Acceptance from a DLI",
      "Gather required documents",
      "Apply online via IRCC portal",
      "Provide biometrics",
      "Wait for processing & receive study permit",
    ],
    documents: ["Valid passport", "Letter of acceptance", "Proof of financial support", "Biometrics", "Immigration medical exam (if required)", "Police certificate"],
    tips: "Apply at least 3 months before your program starts. Use the Student Direct Stream (SDS) for faster processing if eligible.",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    visaType: "Student Visa (Subclass 500)",
    processingTime: "4–6 weeks",
    fee: "AUD 710",
    steps: [
      "Enroll and receive Confirmation of Enrollment (CoE)",
      "Meet health requirements (Overseas Student Health Cover)",
      "Prepare financial evidence",
      "Lodge application via ImmiAccount",
      "Provide biometrics if required",
    ],
    documents: ["CoE from institution", "Valid passport", "OSHC insurance proof", "Financial capacity evidence", "English proficiency results", "Genuine Temporary Entrant statement"],
    tips: "You must enroll in OSHC before applying. The GTE requirement is important — explain why you want to study in Australia.",
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    visaType: "National Visa (Type D)",
    processingTime: "6–12 weeks",
    fee: "EUR 75",
    steps: [
      "Get university admission letter",
      "Open blocked account (Sperrkonto) with ~€11,208",
      "Book visa appointment at German embassy",
      "Attend interview and submit documents",
      "Receive visa and enroll at university",
    ],
    documents: ["Admission letter", "Blocked account proof", "Health insurance", "Language proficiency (German/English)", "Academic transcripts", "Motivation letter"],
    tips: "Germany requires a blocked bank account proving financial stability. Book your embassy appointment early as slots fill up quickly.",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    visaType: "Student Visa",
    processingTime: "3–4 weeks",
    fee: "GBP 490",
    steps: [
      "Receive CAS (Confirmation of Acceptance for Studies)",
      "Prepare financial evidence",
      "Apply online via UK Visas and Immigration",
      "Attend biometrics appointment",
      "Receive visa decision",
    ],
    documents: ["CAS reference number", "Valid passport", "Financial proof (28 days bank statements)", "English language test results", "TB test results (some countries)", "ATAS certificate (some courses)"],
    tips: "You need to show funds for tuition + living costs. Ensure you have funds available for 28 consecutive days before applying.",
  },
]

const generalSteps = [
  { step: 1, icon: BookOpen, title: "Get University Admission", desc: "Receive your official admission or enrollment letter from your university." },
  { step: 2, icon: FileText, title: "Prepare Documents", desc: "Gather passport, financial statements, insurance, and all required supporting documents." },
  { step: 3, icon: Globe, title: "Submit Visa Application", desc: "Apply online or at the embassy/consulate. Pay the visa application fee." },
  { step: 4, icon: CreditCard, title: "Pay Fees & Biometrics", desc: "Pay relevant fees and attend biometrics appointment if required by the country." },
  { step: 5, icon: Clock, title: "Wait for Processing", desc: "Track your application. Processing times vary by country and time of year." },
  { step: 6, icon: Plane, title: "Receive Visa & Travel", desc: "Once approved, arrange travel and prepare for your new academic journey." },
]

const checklist = [
  "Valid passport (6+ months validity beyond your study period)",
  "University acceptance / enrollment letter",
  "Proof of financial support / bank statements",
  "Health insurance documentation",
  "English language proficiency scores (IELTS/TOEFL)",
  "Academic transcripts and certificates",
  "Statement of Purpose / Personal Statement",
  "Passport-size photos (as per country requirements)",
  "Visa application form (completed and signed)",
  "Visa application fee payment receipt",
  "Travel itinerary / flight booking",
  "Police clearance certificate (some countries)",
]

export default function VisaPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-primary pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-4">
            Visa Guidance
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground tracking-tight text-balance">
            Your Complete Visa Guide
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Step-by-step visa guidance for top study destinations. Know exactly what you need before you apply.
          </p>
        </div>
      </section>

      {/* General Steps */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">General Visa Application Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {generalSteps.map((item) => (
              <div key={item.step} className="flex gap-4 p-5 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent-foreground">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country-specific guides */}
      <section className="py-8 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Country-Specific Visa Requirements</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {countries.map((country) => (
              <Card key={country.name} className="border border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <CardTitle className="text-lg">{country.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{country.visaType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1 block">{country.fee}</Badge>
                      <p className="text-xs text-muted-foreground">{country.processingTime}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Steps</h4>
                    <ol className="space-y-1.5">
                      {country.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Required Documents</h4>
                    <ul className="space-y-1">
                      {country.documents.map((doc, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground/80 leading-relaxed">{country.tips}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document Checklist */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-primary-foreground">Universal Document Checklist</h2>
            <p className="mt-2 text-primary-foreground/70">Most study visas require these core documents regardless of destination.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3">
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
