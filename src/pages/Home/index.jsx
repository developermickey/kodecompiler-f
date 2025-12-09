import React from 'react'
import HeroSection from './HeroSection'
import PlatformSection from './PlatformSection'
import CodeCompilerSection from './CodeCompilerSection'
import InterviewPreparation from './InterviewPreparation'
import WeeklyContests from './WeeklyContests'
import InterviewExperience from './InterviewExperience'
import CTASection from '../../components/CtaSection'

const Home = () => {
  return (
    <>
      <HeroSection />
      <PlatformSection />
      <CodeCompilerSection />
      <InterviewPreparation/>
      <WeeklyContests />
      <InterviewExperience />
      <CTASection 
        title="Ready to get started?"
        para="Join thousands of developers who are mastering coding interviews and landing their dream jobs. Start practicing today with our comprehensive platform."
      />

    </>
  )
}

export default Home