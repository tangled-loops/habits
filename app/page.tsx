'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Sidebar from '@/components/ui/sidebar'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Sidebar active={"Home"} />
      <main className='md:ml-[200px] p-10 grid grid-cols-2'>
        <Card className=''>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
        <div>
          lsadjflkjsdklf
        </div>
      </main>
    </>
  )
}
