import Navigation from '@/components/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className='sm:ml-[150px] md:ml-[200px] p-8 flex flex-col'>
          {children}
        </main>
      </body>
    </html>
  )
}
