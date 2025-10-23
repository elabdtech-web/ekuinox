import React from 'react'
import MainLayout from '../layout/MainLayout'
import ProductDetail from '../components/product/ProductDetail'
import FeaturesSection from '../components/product/Feature'
import HeroFeatures from '../components/product/HeroFeatures'
import LuxuryProducts from '../components/product/LuxuryProducts'

const Product = () => {
  return (
    <MainLayout>
      <ProductDetail />
      <FeaturesSection />
      <LuxuryProducts />
      <HeroFeatures />
    </MainLayout>
  );
}

export default Product;
