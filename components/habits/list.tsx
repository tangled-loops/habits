import { Habit } from "@/server/db/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { EditField, Field } from "./table";
import { useState } from "react";

interface HabitCardProps {
  habit: Habit
  onSubmit: () => void
}



function HabitCard({ habit, onSubmit }: HabitCardProps) {
  const [editing, setEditing] = useState<Field>('none')
  const handleSubmit = () => {
    onSubmit()
    setEditing('none')
  }
  const content = (field: Field) => {
    const editField = (value: string | null) => {
      return (
        <EditField
          id={habit.id}
          field={field}
          handleSubmit={handleSubmit}
          value={value}
        />
      );
    };
    const fieldEditing = field === editing;
    switch (field) {
      case 'description': {
        if (fieldEditing) return editField(habit.description);
        return habit.description;
      }
      case 'title': {
        if (fieldEditing) return editField(habit.title);
        return habit.title;
      }
      default: {
        return '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle onClick={() => setEditing('title')}>{content('title')}</CardTitle>
        <CardDescription onClick={() => setEditing('description')}>{content('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        doooop
      </CardContent>
      <CardFooter>
        deeep
      </CardFooter>
    </Card>
  )
}

interface HabitsListProps {
  habits: Habit[],
  onSubmit: () => void
}

/**
 * If I handle the data in here each component should be able to update itself
 * still not sure if this is the *right* way to do it though.
 */
export default function HabitsList({ habits, onSubmit }: HabitsListProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {habits.map((habit) => {
        return <HabitCard habit={habit} onSubmit={onSubmit} />
      })}
    </div>
  )
}