import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Sidebar from '@/components/sidebar'
import { useState } from 'react'
import { getServerSession } from 'next-auth'

export default async function Home() {
  const derp = await getServerSession()
  console.log(derp)
  return (
    <>
      <Sidebar active={"Home"} />
      <main className='md:ml-[200px] p-10 grid grid-cols-2'>
        
      </main>
    </>
  )
}
