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
      <CTASection />

    </>
  )
}

export default Home