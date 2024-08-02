import React from 'react'
import Logo from '../../assets/logo.png'

import { IoIosSearch } from "react-icons/io";
import Darkmode from './Darkmode';
import { FaCaretDown } from "react-icons/fa6";


const Navbar = () => {
    const menu = [
        { id: 1, name: 'Banking', link: '#' },
        { id: 2, name: 'Insurance', link: '#' },
        { id: 3, name: 'Arogya-yojana', link: '#' },
        { id: 4, name: 'Savings', link: '#' },
        { id: 5, name: 'Mutualfund', link: '#' }
    ];
    const  dropdowmlinks  =[
        {id:1,link:'/#',name:'NGO'},
        {id:1,link:'/#',name:'Selling'},
        {id:1,link:'/#',name:'Rated'}

    ]
    
  return (
   

<div className='shadow-md bg-grey-50  ' 
>
    {/* uppersection */}
    <div className='bg-gray-100  flex justify-between  '>

 
     
        <div>
       
        
        <a href='#' className='font-bold text-2xl sm:text-3xl flex gap-2 container'>
            <img src={Logo} alt='logo'
            className='w-60 h-20 '/>
         
        </a>
        
    </div>
    <div className=' justify-between items-center gap-7 flex' >
    <div className='relative group hidden sm:block '>
        <input type='text' placeholder='serch'
        className='w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border 
        border-grey-300 px-1 py1 focus:outline-none focus:border-1 focus:border-primary ' >
           
        </input>
        <IoIosSearch   className='text-grey-500 group-hover:primary absolute top-1/4 -transilate-y-1/2 right-3 justify-items-center mb-10' />
        
    
    </div>
   
       
    </div>
   
    <div>
      
 
    </div>

        </div>
    


   
   


 {/* lower section */}
    <div  className='flex justify-center bg-red-950  text-white'>
     <ul  className='sm:flex hidden items-center gap-4   '>
       {
        menu.map((data)=>(
            <li key={data.id}>
               <a href='#' className='inline-block ps-4 hover:text-primary duration-200 font-bold'> {data.name} </a> 
            </li>
        )) 
       }
       {/* sampledropdown */}

       <li className='group relative cursor-pointer'>
        <a href='#' className='flex items-center gap-[2px] py-2 text-primary'>
            Trending Stocks
            <span>
            <FaCaretDown className='transitiopn-all duration-200 group-hover:rotate-180'  />
            </span>
        </a>
        <div className='absolute z-[9999] hidden group-hover:block w-[150px] rounded-md bg-whitep-2 text-black'>
     <ul>
        {
            dropdowmlinks.map((data)=>(
             <li>
                <a href='#' className='inline-block w-full rounded-md p2 hover:bg-primary/20 '>{data.name}</a>
             </li>   
            ))
        }
     </ul>
     </div>
       </li>

     </ul>
   
    
        

    </div>
</div>
  )
}


export default Navbar