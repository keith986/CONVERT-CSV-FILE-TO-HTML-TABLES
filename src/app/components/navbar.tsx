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
      <li>
        <a href="#" className="flex block py-2 px-3 md:p-0 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-white-700 md:dark:text-white-500 text-sm" aria-current="page">
          <svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"/>
          </svg>
          <span className="mx-2 text-white hover:text-gray-500">Export</span>
        </a> 
      </li>
      <li className="border border-gray-300"></li>
      <li>
        <a href="#" className="text-sm flex block md:p-0 text-white-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white-700 md:dark:hover:text-white-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
        <svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5v14m8-7h-2m0 0h-2m2 0v2m0-2v-2M3 11h6m-6 4h6m11 4H4c-.55228 0-1-.4477-1-1V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v12c0 .5523-.4477 1-1 1Z"/>
        </svg>
        <span className="mx-2 text-white hover:text-gray-500">Add column</span>
        </a>
      </li>
      <li>
        <a href="#" className="text-sm flex block md:p-0 text-white-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white-700 md:dark:hover:text-white-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
          <svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" d="M3 11h18M3 15h18m-9-4v8m-8 0h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
          </svg>
          <span className="mx-2 text-white hover:text-gray-500">Add row</span>
        </a>
      </li>
      <li>
        <a href="#" className="text-sm flex block md:p-0 text-white-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white-700 md:dark:hover:text-white-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
          <svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15v3c0 .5523.44772 1 1 1h16c.5523 0 1-.4477 1-1v-3M3 15V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v9M3 15h18M8 15v4m4-4v4m4-4v4m-5.5061-7.4939L12 10m0 0 1.5061-1.50614M12 10l1.5061 1.5061M12 10l-1.5061-1.50614"/>
          </svg>
          <span className="mx-2 text-white hover:text-gray-500">Delete row</span>
        </a>
      </li>
      <li>
        <a href="#" className="text-sm flex block md:p-0 text-white-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-white-700 md:dark:hover:text-white-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
          <svg className="w-5 h-5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15v3c0 .5523.44772 1 1 1h10.5M3 15v-4m0 4h11M3 11V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v5M3 11h18m0 0v1M8 11v8m4-8v8m4-8v2m1.8956 5.9528 1.5047-1.5047m0 0 1.5048-1.5048m-1.5048 1.5048 1.4605 1.4604m-1.4605-1.4604-1.4604-1.4605"/>
          </svg>
         <span className="mx-2 text-white hover:text-gray-500">Delete table</span>
        </a>
      </li>
    </ul>
  </div>
  </div>
</nav>

  );
}

