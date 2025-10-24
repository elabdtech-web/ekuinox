import React from "react";
import { PiShoppingBag } from "react-icons/pi";
import { useProductCart } from "../../context/ProductCartContext";

const parsePrice = (p) => {
  if (!p) return 0;
  const n = String(p).replace(/[^0-9.]/g, "");
  return Number(n) || 0;
};

const luxuryTimepieces = [
  {
    id: 1,
    name: "Ekuinox Eclipse",
    price: "$12,999",
    img: "/Luxury1.png",
  },
  {
    id: 2,
    name: "Ekuinox Zenith",
    price: "$14,499",
    img: "/Luxury2.png",
  },
  {
    id: 3,
    name: "Ekuinox Aurora",
    price: "$15,299",
    img: "/Luxury3.png",
  },
  {
    id: 4,
    name: "Ekuinox Solstice",
    price: "$16,799",
    img: "/Luxury4.png",
  },
];

const LuxuryProducts = () => {
  const { addItem } = useProductCart();
  return (
    <section className="w-full min-h-screen relative bg-[#070B13] py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-0">
        <div className="flex justify-center ">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
            Luxury Timepieces
          </h2>
        </div>

        <div className="grid grid-cols-1  py-18 sm:grid-cols-2 lg:grid-cols-4 gap-8  mt-10">
          {luxuryTimepieces.map((item) => {
            const priceNum = parsePrice(item.price);
            return (
              <div
                key={item.id}
                className="relative bg-[#181C24] rounded-2xl border border-white/6 shadow-[0_10px_30px_rgba(2,6,23,0.6)] p-6 flex flex-col items-center min-h-[360px]"
              >
                {/* image container - elevated */}
                <div className="w-full flex justify-center mb-2">
                  <div className="h-[180px] w-[150px] absolute -top-12 rounded-xl bg-transparent flex items-center justify-center z-20">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* card body - pushed below the absolute image and centered */}
                <div className="w-full flex flex-col items-center text-center mt-28 z-10">
                  <h3 className="text-white text-lg md:text-xl font-medium mb-2">
                    {item.name}
                  </h3>
                  <p className="text-blue-400 text-2xl md:text-3xl font-semibold mt-1">
                    {item.price}
                  </p>
                </div>

                {/* buttons */}
                <div className="w-full mt-auto  flex items-center gap-3">
                  {/* Primary action: add to product cart */}
                  <button
                    className="px-8 h-12 py-3 w-2/3 bg-[#5695F5] rounded-full text-white font-medium shadow hover:bg-blue-500 transition"
                    onClick={() =>
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        priceNum,
                        img: item.img,
                      })
                    }
                  >
                    Buy Now
                  </button>
                  <button
                    className="h-12 w-1/3 border border-white/8 rounded-full bg-[#0b1218]  flex items-center justify-center"
                    onClick={() =>
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        priceNum,
                        img: item.img,
                      })
                    }
                  >
                    <PiShoppingBag size={24} className=" text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LuxuryProducts;
