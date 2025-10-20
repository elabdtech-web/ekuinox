import React from 'react'
import MainLayout from '../layout/MainLayout'
import StoryHeroSection from '../components/StoryHeroSection'
import StoryNowSection from '../components/StoryNowSection'
import StoryTimelineSection from '../components/StoryTimelineSection'
import StoryStartedSection from '../components/StoryStartedSection'
import StoryTeamSection from '../components/StoryTeamSection'

const StoryPage = () => {
  return (
    <MainLayout>
      <StoryHeroSection />
      <StoryNowSection />
      <StoryTimelineSection />
      <StoryStartedSection />
      <StoryTeamSection />
    </MainLayout>
  )
}

export default StoryPage
