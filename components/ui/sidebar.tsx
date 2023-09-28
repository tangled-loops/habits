
import Link from 'next/link'

const sidebarItems = [
  { title: 'Home', to: '/', }, 
  { title: 'Dashboard', to: '/dashboard', }, 
  { title: 'Habit Tracker', to: '/habit-tracker', }, 
  { title: 'Book Tracker', to: '/book-tracker', }, 
  { title: 'TODO List', to: '/todo', }, 
]

export default function Sidebar() {
  return (
    <>
      <aside className='hidden-small fixed left-0 md:bottom-0 h-screen sm:hidden md:block md:w-[200px] bg-primary'>
        <h1 className='p-3 text-xl whitespace-nowrap text-center text-white font-bold'>
          Habits
        </h1>
        <div className=''>
          <ul className='inline-grid grid-cols-1 w-full'>
            {
              sidebarItems.map((link)=> {
                return (
                <li className='text-white text-md hover:bg-white hover:text-primary h-15 flex flex-col justify-center cursor-pointer'>
                  <Link className='p-4 font-medium' href={link.to}>{link.title}</Link>
                </li>
                )
              })
            }
          </ul>
        </div>
      </aside>
      <nav className='md:hidden h-[50px] transition-transform flex flex-row items-center bg-primary'>
        <div className='inline-grid grid-cols-3 gap-4 w-full'>
          <div className='p-1'>
            left stuff
          </div>
          <h1 className='text-xl text-bold whitespace-nowrap text-center text-white'>
            Habits
          </h1>
          <div className='p-1'>
            right stuff
          </div>
        </div>
        
      </nav>
    </>
    
  )
}
