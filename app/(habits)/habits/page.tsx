import { Table, Header } from '@/components/habits'

import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'


export default async function Habits() {
  const session = await getServerSession()
  console.log(session)
  return (
    <>
      <Header/>
      <div className='grid p-4'>
        <Table/>
      </div>
    </>
  )
}