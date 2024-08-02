import React from 'react'
import Navbar from './Navbar';
import Hero from './hero';
import Prodect from './prodect';
import Emilist from './Emilist';
import Footer from './footer';


function Homepage() {
  return (
    <div>
        <Navbar />
        <Hero /><Prodect /><Emilist />
        <Footer />
    </div>
  )
}

export default Homepage