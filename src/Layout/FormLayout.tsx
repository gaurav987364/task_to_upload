import { Outlet } from 'react-router-dom'
import Stepper from '../components/Stepper';
import Navbar from '../components/Navbar';


const FormLayout = () => {
  return (
   <div className='relative w-full h-screen max-h-[100%] bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
        <div className='w-full h-14'>
          <Navbar/>
        </div>
        <div className='w-full h-20'>
          <Stepper />
        </div>
        <div className='w-full h-[calc(100vh-176px)] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 rounded-t-xl shadow-lg'>
         <Outlet />
        </div>
    </div>
  )
}

export default FormLayout;