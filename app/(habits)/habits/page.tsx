import { getServerSession } from 'next-auth'

export default async function Books() {
  const session = await getServerSession()
  console.log(session)
  return (
    <>
      Doop
    </>
  )
}