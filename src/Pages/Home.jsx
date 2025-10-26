import React from 'react'
import MainLayout from '../layout/MainLayout'
import HeroSection from '../components/home/HeroSection'
import GermenWatch from '../components/home/GermenWatch'
import StorySection from '../components/home/StorySection'


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