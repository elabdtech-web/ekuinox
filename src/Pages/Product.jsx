import React from 'react'
import MainLayout from '../layout/MainLayout'
import ProductDetail from '../components/product/ProductDetail'
import FeaturesSection from '../components/product/Feature'
import HeroFeatures from '../components/product/HeroFeatures'

const Product = () => {
  return (
    <MainLayout>
      <ProductDetail />
      <FeaturesSection />
      <HeroFeatures />
    </MainLayout>
  )
}

export default Product;
