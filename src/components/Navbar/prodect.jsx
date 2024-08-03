import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Player } from '@lottiefiles/react-lottie-player';
import successAnimation from './success.json';
import EmiChart from './EmiChart';

function Product() {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, []);

  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(5);
  const [years, setYears] = useState(5);
  const [monthlyEmi, setMonthlyEmi] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [monthlyEmiData, setMonthlyEmiData] = useState([1200, 1500, 1300, 1600, 1400, 1700, 1450, 1800, 1500, 1900, 1550, 2000]); // Mock data

  const calculateEmi = () => {
    if (loanAmount && interestRate && years) {
      const principal = parseFloat(loanAmount);
      const rate = parseFloat(interestRate) / 100 / 12;
      const n = parseFloat(years) * 12;
      const emi = (principal * rate * (1 + rate) ** n) / ((1 + rate) ** n - 1);
      setMonthlyEmi(emi.toFixed(2));
    }
  };

  const handleSubmit = () => {
    if (!loanAmount || !interestRate || !years) {
      window.alert("Please fill out all fields.");
      return;
    }

    const emiData = {
      loanamount: loanAmount,
      rateofinterest: interestRate,
      years: years,
      monthlyemi: monthlyEmi,
    };

    axios.post("https://emi-calculator-b6jl.onrender.com/additem", emiData)
      .then((response) => {
        console.log("Data added successfully:", response.data);
        window.alert("Data added successfully");
        setIsShow(true);
      })
      .catch((error) => {
        if (error.response) {
          window.alert(error.response.data.message);
        } else {
          window.alert("An error occurred. Please try again later.");
        }
        console.error("Error adding data:", error);
      });
  };

  const handleAddAnother = () => {
    setLoanAmount(50000);
    setInterestRate(5);
    setYears(5);
    setMonthlyEmi('');
    setIsShow(false);
  };

  return (
    <div data-aos='zoom-out' className='mt-[200px] mb-12 container mx-auto '>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='shadow-2xl sm:w-full p-5'>
          <div className='text-center max-w-[600px] mx-auto'>
            <h1 className='text-3xl font-bold'>EMI CALCULATOR</h1>
            <p className='text-xs text-gray-400'>Check your EMI status NOW</p>
          </div>
          <div>
            <div className='place-items-center gap-5 w-full p-20'>
              <form className='justify-center items-center'>
                <div className='relative z-0 w-full mb-5 group'>
                  <label
                    htmlFor='loanAmount'
                    className='text-sm text-gray-500 dark:text-gray-400'
                  >
                    Loan amount: {loanAmount}
                  </label>
                  <input
                    type='range'
                    name='loanAmount'
                    id='loanAmount'
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className='block w-full mt-2'
                    min='0'
                    max='1000000'
                    step='1000'
                  />
                </div>

                <div className='relative z-0 w-full mb-5 group'>
                  <label
                    htmlFor='interestRate'
                    className='text-sm text-gray-500 dark:text-gray-400'
                  >
                    Rate of interest: {interestRate}%
                  </label>
                  <input
                    type='range'
                    name='interestRate'
                    id='interestRate'
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className='block w-full mt-2'
                    min='0'
                    max='20'
                    step='0.1'
                  />
                </div>

                <div className='relative z-0 w-full mb-5 group'>
                  <label
                    htmlFor='years'
                    className='text-sm text-gray-500 dark:text-gray-400'
                  >
                    Years: {years}
                  </label>
                  <input
                    type='range'
                    name='years'
                    id='years'
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className='block w-full mt-2'
                    min='0'
                    max='30'
                    step='1'
                  />
                </div>

                <button
                  type='button'
                  onClick={calculateEmi}
                  className='text-white bg-red-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-900 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Check
                </button>

                <div className='h-10'></div>

                <div className='relative z-0 w-full mb-5 group'>
                  <label
                    htmlFor='monthlyEmi'
                    className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                  >
                    Monthly EMI
                  </label>
                  <input
                    type='text'
                    name='monthlyEmi'
                    id='monthlyEmi'
                    value={monthlyEmi}
                    readOnly
                    className='block py-2.5 px-0 w-full text-sm text-gray-900 appearance-none dark:text-black dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer bg-gray-500/20 rounded-xl dark:border-gray-600'
                  />
                </div>

                <button
                  type='button'
                  onClick={handleSubmit}
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-900 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          {isShow && (
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
              <div className='bg-white p-5 rounded-lg'>
                <Player
                  autoplay
                  loop
                  src={successAnimation}
                  style={{ height: '200px', width: '200px' }}
                />
                <p className='mb-4 mx-4'>Upload successful!</p>
                <a href='#'>
                  <button
                    className='text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700'
                    onClick={handleAddAnother}
                  >
                    Add Another
                  </button>
                  Refresh the page to make changes
                </a>
              </div>
            </div>
          )}
        </div>

        <div className='shadow-2xl sm:w-full p-5'>
          <EmiChart monthlyEmiData={monthlyEmiData} />
        </div>
      </div>
    </div>
  );
}

export default Product;
