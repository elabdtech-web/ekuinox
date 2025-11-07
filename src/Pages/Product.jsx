import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'
import ProductDetail from '../components/product/ProductDetail'
import FeaturesSection from '../components/product/Feature'
import HeroFeatures from '../components/product/HeroFeatures'
import LuxuryProducts from '../components/product/LuxuryProducts'
import { productService } from '../services/productService'

const Product = () => {
  const [searchParams] = useSearchParams();
  const selectedProductId = searchParams.get('id');

  const [products, setProducts] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProductId) {
      loadProductById(selectedProductId);
    } else {
      loadProducts();
    }
    getAllProducts();
  }, [selectedProductId]);

  const loadProductById = async (productId) => {
    try {
      setLoading(true);
      const response = await productService.getProduct(productId);
      console.log('Specific Product API response:', response);

      // Handle different response structures
      let productData = null;
      if (response && typeof response === 'object') {
        if (response.data) {
          productData = response.data;
        } else if (response.name || response._id) {
          productData = response;
        } else {
          productData = response;
        }
      }

      console.log('Loaded specific product:', productData);
      setSelectedProduct(productData);
    } catch (error) {
      console.error('Error loading specific product:', error);
      setSelectedProduct(null);
    } finally {
      setLoading(false);
    }
  };

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

  // get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      console.log('All Products API response:', response);
      setAllProducts(response.data);
    } catch (error) {
      console.error('Error loading all products:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }
  // console.log('Rendering products:', products?.relatedProducts);

  // Get the product to display (selected product or main product)
  const displayProduct = selectedProduct || (Array.isArray(products) ? products[0] : products);

  return (
    <MainLayout>
      <ProductDetail product={displayProduct} loading={loading} />
      <FeaturesSection features={displayProduct?.features || []} loading={loading} />
      <LuxuryProducts products={allProducts} loading={loading} />
      <HeroFeatures />
    </MainLayout>
  );
}

export default Product;
