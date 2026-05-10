import React from 'react'
import Navbar from './navbar'
import About from './about'
import Footer from './footer'

function Aboutcomponent() {
  return (
    <div className='min-h-screen overflow-hidden'>
        <Navbar />
        <About />
        <Footer />
    </div>
  )
}

export default Aboutcomponent