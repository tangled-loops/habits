import Sidebar from '@/components/sidebar'
import { getServerSession } from 'next-auth'

export default async function Register() {
  return (
    <>
      <main className='md:ml-[200px] p-10 grid grid-cols-2'>
        Register Screen
      </main>
    </>
  )
}