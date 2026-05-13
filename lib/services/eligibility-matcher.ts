export interface StudentProfile {
  gpa: number
  englishScore: number
  englishTestType: 'IELTS' | 'TOEFL'
  budget: number
  preferredCountries: string[]
  preferredFields: string[]
  degreeLevel: 'Bachelors' | 'Masters' | 'PhD'
}

export interface UniversityRequirements {
  id: string
  name: string
  country: string
  city: string
  minGPA: number
  minEnglishScore: number
  englishTestType: 'IELTS' | 'TOEFL'
  tuitionFee: number
  selectivityRank: number // Lower is more competitive
  fields: string[]
  degreeLevel: string
}

export interface MatchResult {
  universityId: string
  universityName: string
  country: string
  tuition: number
  fitScore: number // 0-100
  category: 'safe' | 'moderate' | 'reach'
  reasons: string[]
  matchPercentage: number
}

// Calculate fit score based on student profile vs university requirements
export function calculateFitScore(student: StudentProfile, university: UniversityRequirements): {
  fitScore: number
  category: 'safe' | 'moderate' | 'reach'
  reasons: string[]
} {
  let fitScore = 100
  const reasons: string[] = []

  // GPA scoring (40% weight)
  const gpaDifference = student.gpa - university.minGPA
  if (gpaDifference >= 0.5) {
    fitScore += 10
    reasons.push('Strong GPA - exceeds requirements')
  } else if (gpaDifference >= 0.2) {
    fitScore += 5
    reasons.push('GPA meets requirements')
  } else if (gpaDifference >= 0) {
    fitScore += 0
    reasons.push('GPA meets minimum requirements')
  } else if (gpaDifference >= -0.3) {
    fitScore -= 10
    reasons.push('GPA slightly below requirements')
  } else {
    fitScore -= 25
    reasons.push('GPA significantly below requirements')
  }

  // English score scoring (30% weight)
  const englishDifference = student.englishScore - university.minEnglishScore
  if (englishDifference >= 1) {
    fitScore += 8
    reasons.push('Strong English proficiency')
  } else if (englishDifference >= 0.5) {
    fitScore += 4
    reasons.push('English score meets requirements')
  } else if (englishDifference >= 0) {
    fitScore += 0
    reasons.push('English score meets minimum')
  } else if (englishDifference >= -0.5) {
    fitScore -= 8
    reasons.push('English score slightly below required')
  } else {
    fitScore -= 20
    reasons.push('English score needs improvement')
  }

  // Budget fit (15% weight)
  if (student.budget >= university.tuitionFee) {
    fitScore += 7
    reasons.push('Budget covers tuition')
  } else if (student.budget >= university.tuitionFee * 0.8) {
    fitScore += 3
    reasons.push('Tuition is within budget range')
  } else if (student.budget >= university.tuitionFee * 0.6) {
    fitScore -= 5
    reasons.push('Budget may require financial aid')
  } else {
    fitScore -= 15
    reasons.push('Tuition exceeds budget significantly')
  }

  // Country preference (10% weight)
  if (student.preferredCountries.includes(university.country)) {
    fitScore += 5
    reasons.push('University in preferred country')
  } else {
    fitScore -= 3
    reasons.push('Not in preferred country')
  }

  // Field of study match (5% weight)
  const fieldMatch = student.preferredFields.some(field => 
    university.fields.some(uField => uField.toLowerCase().includes(field.toLowerCase()) || field.toLowerCase().includes(uField.toLowerCase()))
  )
  if (fieldMatch) {
    fitScore += 3
    reasons.push('Offers your preferred field')
  }

  // Degree level match
  if (student.degreeLevel === university.degreeLevel) {
    fitScore += 2
  }

  // Selectivity adjustment
  if (university.selectivityRank < 50) {
    fitScore -= 10
    reasons.push('Highly selective university')
  } else if (university.selectivityRank < 100) {
    fitScore -= 5
    reasons.push('Competitive university')
  }

  // Clamp fit score between 0 and 100
  fitScore = Math.max(0, Math.min(100, fitScore))

  // Categorize based on fit score
  let category: 'safe' | 'moderate' | 'reach'
  if (fitScore >= 75) {
    category = 'safe'
  } else if (fitScore >= 50) {
    category = 'moderate'
  } else {
    category = 'reach'
  }

  return { fitScore, category, reasons }
}

// Match student against multiple universities
export function matchStudentToUniversities(
  student: StudentProfile,
  universities: UniversityRequirements[]
): MatchResult[] {
  const results = universities.map((university) => {
    const { fitScore, category, reasons } = calculateFitScore(student, university)
    return {
      universityId: university.id,
      universityName: university.name,
      country: university.country,
      tuition: university.tuitionFee,
      fitScore,
      category,
      reasons,
      matchPercentage: fitScore,
    }
  })

  // Sort by fit score descending
  return results.sort((a, b) => b.fitScore - a.fitScore)
}

// Get summary statistics
export function getMatchSummary(results: MatchResult[]) {
  const safeCount = results.filter(r => r.category === 'safe').length
  const moderateCount = results.filter(r => r.category === 'moderate').length
  const reachCount = results.filter(r => r.category === 'reach').length
  const averageFitScore = results.reduce((sum, r) => sum + r.fitScore, 0) / results.length

  return {
    safeCount,
    moderateCount,
    reachCount,
    averageFitScore: Math.round(averageFitScore),
    totalMatches: results.length,
  }
}
