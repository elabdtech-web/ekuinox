import React from "react";
import { motion } from "framer-motion";
import { PiShoppingBag } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useProductCart } from "../../context/ProductCartContext";
import Cart from "../../common/Cart";

const parsePrice = (p) => {
  if (!p) return 0;
  const n = String(p).replace(/[^0-9.]/g, "");
  return Number(n) || 0;
};


const LuxuryProducts = ({ products, loading }) => {


  const { addItem } = useProductCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const closeCart = () => setIsCartOpen(false);



  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#070B13]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5695F5] mx-auto"></div>
          <p className="text-white mt-4">Loading luxury products...</p>
        </div>
      </div>
    );
  }


  // Filter out any string IDs and only show valid product objects
  const validProducts = (products || []).filter(item => typeof item === 'object' && item !== null);

  if (validProducts.length === 0) {
    return (
      <section className="w-full min-h-screen relative bg-[#070B13] py-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <h2 className="text-3xl md:text-4xl mb-8 lg:text-5xl font-semibold text-white">
              Luxury Timepieces
            </h2>
          </motion.div>
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No luxury products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen relative bg-[#070B13] py-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-0 " >
        {/* Heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <h2 className="text-3xl md:text-4xl mb-8 lg:text-5xl font-semibold text-white">
            Luxury Timepieces
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-y-12 gap-x-6 mt-16">
          {validProducts.map((item, index) => {
            // Handle both full product objects and product IDs
            const productData = typeof item === 'string' ? null : item;
            const priceNum = parsePrice(productData?.price);

            return (
              <motion.div
                key={productData?._id || productData?.id || item || index}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative bg-[#181C24] rounded-2xl border border-white/6 shadow-[0_10px_30px_rgba(2,6,23,0.6)] p-6 cursor-pointer flex flex-col items-center min-h-[380px]"
                onClick={() => navigate(`/product?id=${productData._id || productData.id}`)}
                disabled={!productData}
              >
                {/* Animated image container */}
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.25,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="w-full flex justify-center mb-2"
                >
                  <div className="h-[180px] w-[150px] absolute -top-12 rounded-xl flex items-center justify-center z-20">
                    <img
                      src={
                        productData?.images && Array.isArray(productData.images)
                          ? (productData.images.find(img => img.isMain)?.url || productData.images[0]?.url || '/Luxury1.png')
                          : '/Luxury1.png'
                      }
                      alt={productData?.name || 'Luxury Watch'}
                      className="h-full w-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                </motion.div>

                {/* Card body */}
                <div className="w-full flex flex-col items-center text-center mt-28 z-10">
                  <h3 className="text-white text-lg md:text-xl font-medium mb-2">
                    {productData?.name || 'Luxury Watch'}
                  </h3>
                  <p className="text-blue-400 text-2xl md:text-3xl font-semibold mt-1">
                    ${productData?.price || '0.00'}
                  </p>
                </div>

                {/* Buttons */}
                <div className="w-full mt-auto flex flex-col gap-2">
                  {/* <button
                    className="px-4 py-2 bg-[#5695F5] rounded-full text-white font-medium shadow hover:bg-blue-500 transition disabled:opacity-50 text-sm"
                    onClick={() => navigate(`/product?id=${productData._id || productData.id}`)}
                    disabled={!productData}
                  >
                    View Details
                  </button> */}
                  <div className="flex items-center gap-3">
                    <button
                      className="px-6 h-10 py-2 w-2/3 bg-[#5695F5] rounded-full text-white font-medium shadow hover:bg-blue-500 transition disabled:opacity-50 text-sm"
                      onClick={async () => {
                        if (productData) {
                          try {
                            await addItem({
                              id: productData._id || productData.id,
                              name: productData.name,
                              price: productData.price,
                              priceNum,
                              img: productData.images && Array.isArray(productData.images)
                                ? (productData.images.find(img => img.isMain)?.url || productData.images[0]?.url || '/Luxury1.png')
                                : '/Luxury1.png',
                            });
                          
                          } catch (error) {
                            console.error('Error adding to cart:', error);
                            alert('Failed to add product to cart. Please try again.');
                          }
                        }
                      }}
                      disabled={!productData}
                    >
                      Buy Now
                    </button>
                    <button
                      className="h-10 w-1/3 border border-white/8 rounded-full bg-[#0b1218] flex items-center justify-center hover:bg-white/5 transition disabled:opacity-50"
                      onClick={() => setIsCartOpen(true)}
                      disabled={!productData}
                    >
                      <PiShoppingBag size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
            <Cart open={isCartOpen} onClose={closeCart} />
      
    </section>
  );
};

export default LuxuryProducts;





