import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import image1 from '../../assets/popup1.png'

function Emilist() {
  const [loanhistory, setLoanhistory] = useState([]);
  const [isShow, setIsShow] = useState(false);

  const getPastList = () => {
    axios.get('https://emi-calculator-b6jl.onrender.com/getitem')
      .then((response) => {
        console.log("Response data:", JSON.stringify(response.data));
        if (response.data && response.data.length > 0) {
          setLoanhistory(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const popup = () => {
    setIsShow(true);
  };

  const closePopup = () => {
    setIsShow(false);
  };

  useEffect(() => {
    getPastList();
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className='w-screen h-auto bg-white backdrop-blur-sm py-10 mb-20'>
      <div className='container mx-auto px-4 flex flex-col items-center'>
        <div className='space-y-6 w-full max-w-4xl mx-auto'>
          <div className='w-full mt-10'>
            <h2 className='text-xl font-bold text-red-950'>Previous EMIs</h2>
            {loanhistory.length > 0 ? (
              <ul className='list-disc pl-5'>
                {loanhistory.map((data, index) => (
                  <li key={index} className='text-red-950 mb-2'>
                    <div data-aos='fade-right' className='block w-full py-2.5 px-4 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-xl dark:border-gray-600 dark:text-black dark:focus:border-blue-500 focus:outline-none shadow-bulge focus:ring-0 focus:border-blue-600 bg-gray-600 drop-shadow-2xl shadow-deep mb-5 font-bold justify-around'>
                      <span className='font-bold text-lg text-red-900'>Loan Amount: {data.loanamount}, Interest Rate: {data.rateofinterest}%, Years: {data.years}, <span className='shadow-bulge'>Monthly EMI: {data.monthlyemi}</span></span>
                      <div className='sm:mx-[650px]'>
                        <button className='bg-red-800 mx-20 right-0 p-2 rounded shadow-bulge text-white' onClick={popup}>Apply</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-white'>No loan history available.</p>
            )}
            <Link to='/about'>
              <button
                type='button'
                className='px-40 text-white text-lg bg-blue-700 hover:bg-blue-800 hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-900 dark:hover:bg-gray-400 dark:focus:ring-blue-800'
              >
                More about us
              </button>
            </Link>
          </div>
          {isShow && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
              <div className='sm:w-[1200px] sm:p-20 bg-white grid sm:grid-cols-2 grid-cols-1 w-[350px] p-4 relative'>
                <button 
                  className='absolute top-2 right-2 text-black bg-white rounded-full p-2' 
                  onClick={closePopup}
                >
                  X
                </button>
                <img src={image1} className='sm:h-[400px] hidden sm:block' alt="popup image"></img>
                <div className='bg-white'>
                  <form className="max-w-md mx-auto">
                    <div className="relative z-0 w-full mb-5 group">
                      <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                      <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <input type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                      <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                      <input type="password" name="repeat_password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                      <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="floating_last_name" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number (123-456-7890)</label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="floating_company" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company (Ex. Google)</label>
                      </div>
                    </div>
                    <button type="submit" className="text-white bg-red-900 hover:bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-900 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                  </form>
                  <p className='text-green-600 font-bold'>Our Customer Support Team Will Contact You With in 24min</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Emilist;

