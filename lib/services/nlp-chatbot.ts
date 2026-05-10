// NLP-based responses for study abroad guidance
export interface ChatContext {
  studentProfile?: {
    gpa?: number
    englishScore?: number
    budget?: number
    preferredCountries?: string[]
  }
}

// Knowledge base for common study abroad questions
const studyAbroadKnowledge = {
  application: {
    keywords: ['application', 'apply', 'submit', 'process', 'how to apply'],
    response: `Here are the typical steps for university applications:
1. **Research**: Find universities that match your profile
2. **Gather Documents**: Prepare transcripts, test scores, LORs
3. **Write SOP**: Create a compelling Statement of Purpose
4. **Submit**: Apply before the deadline (usually January-March)
5. **Wait**: Universities take 4-8 weeks to review
6. **Decide**: Compare offers and accept one

Pro tip: Start applications 3-4 months before deadlines.`,
  },
  visa: {
    keywords: ['visa', 'student visa', 'work permit', 'immigration', 'travel document'],
    response: `Visa requirements vary by country:
- **Canada**: Needs study permit (apply after admission letter)
- **UK**: Student visa (can work 20 hrs/week during studies)
- **Australia**: Student visa (can work up to 20 hrs/week)
- **US**: F-1 visa (restricted work authorization)
- **Germany**: Generally visa-free for EU, residence permit for others

Timeline: Apply for visa 2-3 months before your start date.`,
  },
  sop: {
    keywords: ['sop', 'statement of purpose', 'motivation', 'essay', 'personal statement'],
    response: `Tips for writing a strong Statement of Purpose:
1. **Start Strong**: Hook the reader with your passion
2. **Tell Your Story**: Connect your background to your goals
3. **Why This Program**: Show specific knowledge of the university
4. **Career Goals**: Be clear about what you want to achieve
5. **Why This Country**: Explain relevance to your plans
6. **Keep it Concise**: Usually 500-750 words

Common mistakes to avoid: Generic templates, spelling errors, unrealistic goals.`,
  },
  scholarship: {
    keywords: ['scholarship', 'financial aid', 'funding', 'sponsorship', 'grants'],
    response: `Funding options for international students:
1. **University Scholarships**: Merit-based or need-based
2. **Government Funding**: Some countries offer scholarships (Erasmus, DAAD)
3. **Private Organizations**: Cultural, religious, or professional scholarships
4. **Loans**: Education loans from banks or governments
5. **Work Study**: Part-time jobs on campus

Start looking for scholarships 1 year before you plan to study.`,
  },
  documents: {
    keywords: ['documents', 'transcript', 'certificate', 'lor', 'letter of recommendation'],
    response: `Required documents for most universities:
1. **Academic Transcripts**: Official copies from your institution
2. **Test Scores**: IELTS/TOEFL, GRE/GMAT (if required)
3. **Letters of Recommendation**: Usually 2-3 from professors
4. **Statement of Purpose**: Your motivation and goals
5. **Resume/CV**: Your academic and professional background
6. **Passport Copy**: For identity verification

Tip: Request documents at least 4 weeks before submission deadline.`,
  },
  accommodation: {
    keywords: ['accommodation', 'housing', 'hostel', 'rent', 'dormitory', 'flat'],
    response: `Housing options for international students:
1. **On-Campus Housing**: University dorms (safest, community)
2. **Private Rentals**: Apartments near campus (independent)
3. **Shared Housing**: Split cost with other students
4. **Host Families**: Live with a local family (cultural immersion)

Timeline: Start looking 2-3 months after admission.
Budget: $300-1000/month depending on location and type.`,
  },
  work: {
    keywords: ['work', 'job', 'employment', 'part-time', 'intern'],
    response: `Working while studying abroad:
- **On-Campus Jobs**: Usually allowed 20 hours/week
- **Off-Campus**: Restrictions vary by country/visa
- **Internships**: Often part of the curriculum
- **Part-time**: Recommended limit is 20 hours/week max

Check your visa regulations before working. Most countries allow some form of work.`,
  },
  cost: {
    keywords: ['cost', 'expense', 'budget', 'afford', 'price', 'expensive'],
    response: `Typical annual costs for international students:
1. **Tuition**: $10,000-$60,000+ (varies by country)
2. **Accommodation**: $6,000-$12,000
3. **Food**: $3,000-$5,000
4. **Transportation**: $1,000-$2,000
5. **Personal**: $2,000-$4,000
6. **Total**: $22,000-$83,000+ per year

Budget tip: Start saving early and explore scholarship opportunities.`,
  },
  countries: {
    keywords: ['country', 'canada', 'uk', 'australia', 'usa', 'germany', 'europe'],
    response: `Popular study destinations:
- **Canada**: High quality education, affordable, work opportunities
- **UK**: Prestigious universities, shorter programs, English-speaking
- **Australia**: Quality education, post-study work rights, good quality of life
- **USA**: Top-ranked universities, diverse programs, high cost
- **Germany**: Low tuition, strong engineering/tech programs
- **Netherlands**: English-taught programs, affordable, central location

Consider: Your goals, budget, language proficiency, and lifestyle.`,
  },
}

// Extract intent from user message using simple NLP
function extractIntent(message: string): string {
  const lowerMessage = message.toLowerCase().trim()
  
  for (const [intent, data] of Object.entries(studyAbroadKnowledge)) {
    if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent
    }
  }
  
  return 'default'
}

// Main NLP response generator
export function generateNLPResponse(userMessage: string, context?: ChatContext): string {
  const intent = extractIntent(userMessage)
  
  if (intent === 'default') {
    return getDefaultResponse(userMessage)
  }
  
  const response = studyAbroadKnowledge[intent as keyof typeof studyAbroadKnowledge]
  if (response) {
    return response.response
  }
  
  return getDefaultResponse(userMessage)
}

// Default response when intent is unclear
function getDefaultResponse(message: string): string {
  const responses = [
    `I'm Lynx, your AI study abroad assistant! I can help with:
• University matching and eligibility checks
• Application process and timelines
• Visa and immigration guidance
• SOP writing tips
• Scholarship and funding options
• Accommodation and living costs
• Working while studying abroad

What would you like to know more about?`,
    
    `That's a great question! I can provide guidance on:
- Finding the right universities for you
- Application requirements and process
- Visa procedures for different countries
- Funding and scholarship opportunities
- Living expenses and accommodation
- Student work opportunities abroad

What aspect of studying abroad interests you most?`,

    `I'm here to help with your study abroad journey! Feel free to ask me about:
• Your eligibility for specific universities
• Countries and programs that match your profile
• Step-by-step application guidance
• Financial planning and scholarships
• Practical tips for moving abroad
• Common FAQs about studying internationally

How can I assist you today?`,
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// Contextual response based on student profile
export function generateContextualResponse(userMessage: string, studentProfile?: any): string {
  if (!studentProfile) {
    return generateNLPResponse(userMessage)
  }

  const message = userMessage.toLowerCase()
  
  if (message.includes('eligible') || message.includes('qualify') || message.includes('match')) {
    return `Based on your profile (GPA: ${studentProfile.gpa}, English: ${studentProfile.englishScore}), I can help you find universities where you have strong chances of admission. Would you like me to check specific universities or show you general recommendations?`
  }
  
  if (message.includes('afford') || message.includes('budget') || message.includes('cost')) {
    return `With your budget of $${studentProfile.budget}/year, you have great options in:
- Canada (often $25,000-35,000)
- Australia (around $30,000-45,000)
- Germany (very affordable, sometimes free)

Would you like recommendations for universities within your budget?`
  }
  
  if (message.includes('country') || message.includes('destination')) {
    const countries = studentProfile.preferredCountries?.join(', ') || 'various countries'
    return `Great! You're interested in ${countries}. These are excellent study destinations. Let me show you top universities in these countries that match your profile.`
  }

  return generateNLPResponse(userMessage, { studentProfile })
}
