import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

function Emilist() {
  const [loanhistory, setLoanhistory] = useState([]);

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

  useEffect(() => {
    getPastList();
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className='w-screen h-auto bg-secondary backdrop-blur-sm py-10 mb-20'>
      <div className='container mx-auto px-4 flex flex-col items-center'>
        <div className='space-y-6 w-full max-w-4xl mx-auto'>
          <div className='w-full mt-10'>
            <h2 className='text-xl font-bold text-white'>Previous EMIs</h2>
            {loanhistory.length > 0 ? (
              <ul className='list-disc pl-5'>
                {loanhistory.map((data, index) => (
                  <li key={index} className='text-white mb-2'>
                    <div className='block w-full py-2.5 px-4 text-sm text-gray-900 bg-transparent border border-gray-300 rounded-xl dark:border-gray-600 dark:text-black dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 bg-gray-600'>
                      Loan Amount: {data.loanamount}, Interest Rate: {data.rateofinterest}%, Years: {data.years}, Monthly EMI: {data.monthlyemi}
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
                className='px-20 text-black bg-blue-700 hover:bg-blue-800 hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-white dark:hover:bg-gray-400 dark:focus:ring-blue-800'
              >
                More about us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emilist;
