import Sidebar from '@/components/sidebar'
import { getServerSession } from 'next-auth'

export default async function Logout() {
  return (
    <>
      <main className='md:ml-[200px] p-10 grid grid-cols-2'>
        Logout Screen
      </main>
    </>
  )
}