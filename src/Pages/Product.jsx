import React, { useEffect, useState } from 'react'
import MainLayout from '../layout/MainLayout'
import ProductDetail from '../components/product/ProductDetail'
import FeaturesSection from '../components/product/Feature'
import HeroFeatures from '../components/product/HeroFeatures'
import LuxuryProducts from '../components/product/LuxuryProducts'
import { productService } from '../services/productService'

const Product = () => {

  const [products, setProducts] = useState(null);
  // const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getLatestProducts();
      console.log('Product API response:', response);

      // Handle different response structures
      let productsData = null;
      if (response && typeof response === 'object') {
        // If response has data property (common API pattern)
        if (response.data) {
          productsData = Array.isArray(response.data) ? response.data[0] : response.data;
        }
        // If response is directly the product object
        else if (response.name || response._id) {
          productsData = response;
        }
        // If response has products property
        else if (response.products) {
          productsData = Array.isArray(response.products) ? response.products[0] : response.products;
        }
        // Fallback to response itself
        else {
          productsData = response;
        }
      }

      console.log('Processed products data:', productsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(null); // Set to null on error
    } finally {
      setLoading(false);
    }
  };

  // console.log('Rendering products:', products?.relatedProducts);

  // Get the main product (first one) and related products
  const mainProduct = Array.isArray(products) ? products[0] : products;
  const relatedProducts = Array.isArray(products) ? products.slice(1) : (products?.relatedProducts || []);

  return (
    <MainLayout>
      <ProductDetail product={mainProduct} loading={loading} />
      <FeaturesSection features={mainProduct?.features || []} loading={loading} />
      <LuxuryProducts products={relatedProducts} />
      <HeroFeatures />
    </MainLayout>
  );
}

export default Product;
