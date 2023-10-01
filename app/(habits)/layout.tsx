import Navigation from '@/components/navigation'

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className='sm:ml-[150px] md:ml-[200px] p-8 flex flex-col'>
        {children}
      </main>
    </>
  )
}
