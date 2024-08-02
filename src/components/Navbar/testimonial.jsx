import React from 'react'
import Slider from 'react-slick'

function Testimonial() {
    var settings = {
        dots:true,
        arrows:false,
        infinte:true,
        speed:500,
        slidesToScroll:1,
        autoplay:true,
        autoplayspeed:2000,
        cssEase:'linear',
        pauseOnHover:true,
        pauseOnFocus:true,
        responsive:[
            {
                breakpoint:10000,
                settings:{
                    slidesToShow:3,
                    slidesToScroll:1,
                    infinite:true,


                }
            },
            {
                breakpoint:1024,
                settings:{
                    slidesToShow:2,
                    slidesToScroll:1,
                    initialSlide:2

                },

            },
            {
                breakpoint:640,
                settings:{
                    slidesToShow:1,
                    slideToScroll:1
                }
            }
           

        ]
    }
    const testimonialdata = [
        {
            id:1,
            name:"Victor",
            text:'Good quality materials have the uality in thier cloths .having wonderfull exerience with gancy',
            img:'https://picsum.photos/101/101'
        },
        {
            id:2,
            name:"Nadela",
            text:'Quality is not just a word is created fro a ualified technitions and they give more information for the purchase of good quality materials',
            img:'https://picsum.photos/102/102'
        },
        {
            id:3,
            name:"Mnjona",
            text:'Good quality materials have the uality in thier cloths .having wonderfull exerience with gancy',
            img:'https://picsum.photos/103/103'
        },
        {
            id:4,
            name:"Manviya",
            text:'Quality is not just a word is created fro a ualified technitions and they give more information for the purchase of good quality materials',
            img:'https://picsum.photos/104/104'
        },
        {
            id:1,
            name:"Vancina",
            text:'Good quality materials have the uality in thier cloths .having wonderfull exerience with gancy',
            img:'https://picsum.photos/105/105'
        }
    ]
  return (
    <div className='py-10 mb-10'> 
        <div className='container'>
            <div>
                {/* header section */}
                <div className='text-center max-w-[600px] mx-auto'>
          <p className='text-sm text-primary'>What our customers are saying</p>
          <h1 className='text-3xl font-bold '>Testimonial</h1>
         
        </div>
        <div>
            {/* Testimonial card */}
            <Slider {...settings}>
                {testimonialdata.map((data)=>(
                    <div key={data.id} className='flex flex-col  shadow-lg py-8 px-6 mx-4 rounded-xl   mb-10'>
                        <div>
                            <img src={data.img} className='rounded-full w-20 h-20'></img>
                            <p className='text-xs text-gray-400'>{data.text}</p>
                            <h1 className='ttext-xl font-bold text-black/80'>{data.name}</h1>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
                </div>

        </div>
    </div>
  )
}

export default Testimonial