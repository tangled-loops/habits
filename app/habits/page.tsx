import Sidebar from '@/components/sidebar'
import { getServerSession } from 'next-auth'

export default async function Books() {
  const derp = await getServerSession()
  console.log(derp)
  return (
    <>
      <Sidebar active='Habits' />
      <main className='md:ml-[200px] p-10 grid grid-cols-2'>
        
      </main>
    </>
  )
}