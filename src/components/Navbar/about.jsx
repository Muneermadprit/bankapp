import React, { useEffect } from 'react';
import banner from '../../assets/banner.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './Navbar';
import Hero from './hero';
import image1 from '../../assets/about1.jpg'
import image2 from '../../assets/about-2.jpg'
import image3 from '../../assets/about-3.jpg'
import Testimonial from './testimonial';
import Footer from './footer';

function About() {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);
  
  return (
    <>
     <Navbar/>
    <div data-aos='fade-up'  className='w-full bg-red-950/10 h-[500px]' >
    <div className='text-center max-w-[600px] mx-auto'>
          <p className='text-sm text-primary'>The perfect banking partner</p>
          <h1 className='text-3xl font-bold'>ABOUT-US</h1>
          <p className='text-xs text-gray-400'>G00d customer relatonship</p>
        </div>
        <div className='text-center max-w-[900px] mx-auto'>
        <h1 className='sm:text-2xl  text-1sm font-bold mb-10'>We are the leading banking and finacial sector Investor with 10 years of customer relationship and management skill</h1>
          </div>
          <div className='text-center max-w-[900px] sm:mx-auto  grid grid-cols-1 sm:grid-cols-3' data-aos='flip-right'>
            <img src={image1} className='sm:max-w-[900px] hidden sm:block'data-aos='flip-right'></img>
            <img src={image2} className='sm:max-w-[170px]  hidden sm:block'data-aos='flip-left'></img>
            <img src={image3} className='max-w-[170px]  hidden sm:block'data-aos='flip-right'></img>
          </div>
          <div> <img src={image2} className='max-w-[900px] mb-10  w-[400px] sm:hidden'data-aos='flip-right'></img> </div>
        <Testimonial/>
        <Footer/>
    </div>
    </>
  
  );
}

export default About;
