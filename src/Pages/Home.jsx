import React from 'react'
import MainLayout from '../layout/MainLayout'
import HeroSection from '../home/HeroSection'
import GermenWatch from '../home/GermenWatch'
import StorySection from '../home/StorySection'

const Home = () => {
  return (
    <MainLayout>
      <HeroSection/>
      <GermenWatch/>
      <StorySection/>

    </MainLayout>
  )
}

export default Home