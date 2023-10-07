import HabitsForm from '@/components/habits/form';

export default async function Create() {
  return (
    <div className='flex min-h-screen flex-col p-4'>
      <div className='grid rounded-lg border'>
        <HabitsForm submitTitle='Create Habit' />
      </div>
    </div>
  );
}
