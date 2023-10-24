import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HasColors, HasHabit } from "./types";
import { LucideStickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

function Notes({ habit }: HasHabit) {
  return <span>{habit.notes}</span>;
}

const NotesAccordianItem = ({ habit, colors }: HasHabit & HasColors) => {
  if (habit.notes.length === 0) return null;
  return (
    <AccordionItem value='item-2'>
      {habit.notes.length > 60 ? (
        <>
          <AccordionTrigger>
            <div className='flex flex-row items-center'>
              <LucideStickyNote className={cn('mr-2', colors.text)} />
              Notes
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Notes habit={habit} />
          </AccordionContent>
        </>
      ) : (
        <div className='flex flex-col justify-center py-4'>
          <div className='flex flex-row items-center'>
            <LucideStickyNote className={cn('mr-2', colors.text)} />{' '}
            {habit.notes}
          </div>
        </div>
      )}
    </AccordionItem>
  );
};

export { Notes, NotesAccordianItem }