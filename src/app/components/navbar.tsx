import Link from "next/link"

export default function Navbar() {
  return (   
<nav>
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <div>
    <Link href="/" className="text-white hover:text-gray-500">CSV Records</Link>
  </div>

  <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"></div>

  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 rounded-4xl border border-gray-800 p-2 backdrop-blur-sm bg-white/30 dark:bg-gray-800">
    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
      <li className="hover:scale-95 transition-all">
        <a href="#" className="flex block py-2 px-3 md:p-0 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-white-700 md:dark:text-white-500 text-sm" aria-current="page">
          <svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"/>
          </svg>
          <span className="mx-2 text-white">Export</span>
        </a> 
      </li>
      <li className="border border-gray-300"></li>
      <li className="hover:scale-95 transition-all">
        <a href="#" className="text-sm flex block md:p-0 text-white-900 rounded-sm md:hover:bg-transparent md:hover:text-white-700 md:dark:hover:text-white-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
          <svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15v3c0 .5523.44772 1 1 1h10.5M3 15v-4m0 4h11M3 11V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v5M3 11h18m0 0v1M8 11v8m4-8v8m4-8v2m1.8956 5.9528 1.5047-1.5047m0 0 1.5048-1.5048m-1.5048 1.5048 1.4605 1.4604m-1.4605-1.4604-1.4604-1.4605"/>
          </svg>
         <span className="mx-2 text-white">Delete All table</span>
        </a>
      </li>
       <li className="border border-gray-300"></li>
      <li className="hover:scale-95 transition-all">
        <a href="#" className="text-sm flex block md:p-0 text-white-900 rounded-sm md:hover:bg-transparent md:hover:text-white-700 md:dark:hover:text-white-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
          <svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z"/>
          </svg>
         <span className="mx-2 text-white">Print</span>
        </a>
      </li>
    </ul>
  </div>
  </div>
</nav>

  );
}

