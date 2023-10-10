import HabitsForm from "@/components/habits/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getClient } from "@/server/session";

export default async function Edit({ params }: { params: { id: string } }) {
  const api = await getClient()
  const tags = await api.tags.findAll()
  const habit = await api.habits.findById({ id: params.id })

  return (
    <div className='flex min-h-full flex-col p-4'>
      <div className='grid rounded-lg'>
        <Card>
          <CardHeader>
            <CardTitle>Create a Habit to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitsForm data={habit} submitTitle='Save' tags={tags} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
