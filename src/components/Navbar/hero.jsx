import React from 'react';
import image1 from '../../assets/hero.jpg';
import image2 from '../../assets/card.png';
import image3 from '../../assets/hero1.png';
import image4 from '../../assets/hero2.png';
import image5 from '../../assets/hero3.png';
import Slider from 'react-slick';

function Hero() {
  var settings = {
    dots: true,
    arrows: false,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Corrected capitalization
    cssEase: 'linear',
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slideToScroll: 1,
        },
      },
    ],
  };

  return (
    <div
      className="relative overflow-hidden sm:min-h-[650px] bg-grey-100 flex justify-center items-center"
      style={{ backgroundImage: `url(${image1})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
    >
      <div className="h-[700px] w-[700px] bg-red-950/50 absolute top-1/4 left-0 rounded-3xl -rotate-45 -z-9"></div>
      {/* hero section */}
      <div className="container pb-8 sm:pb-0  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-center">
          {/* text content section */}
          <div className="order-1 sm:order-1 h-[500px]  ">
          
            <Slider {...settings}>
              {/* Slide 1 */}
              <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1">
              <img src={image3} className='w-80'/>
               
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary">75% </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary">Home Loan!!!</h1>
                <p className="text-sm font-bold">
                  Muneer The pro developer with one year hands-on experience in the field of
                </p>
                <button className="w-[200px] bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 p-5 rounded text-white hover:text-black font-bold shadow-white mx-20">
                  ORDER NOW
                </button>
              </div>
              {/* Slide 2 */}
              <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1">
              <img src={image4} className='w-80'/>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary">50% </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary">Mutual Fund!!!</h1>
                <p className="text-sm font-bold">
                  Limited time offer! Grab your favorite items now.
                </p>
                <button className="w-[200px] bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 p-5 rounded text-white hover:text-black font-bold shadow-white mx-20">
                  SHOP NOW
                </button>
              </div>
              {/* Slide 3 */}
              <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1">
              <img src={image5} className='w-60'/>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary">30% </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary">Gold Loan!!!</h1>
                <p className="text-sm font-bold">
                  Enjoy exclusive discounts on all products.
                </p>
                <button className="w-[200px] bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 p-5 rounded text-white hover:text-black font-bold shadow-white mx-20">
                  BUY NOW
                </button>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
