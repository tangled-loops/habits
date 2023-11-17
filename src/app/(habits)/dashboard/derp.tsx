import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Derp() {
  return (
    <>
      <h2 className='m-4 ml-16'>Derp</h2>
      <Select>
        <SelectTrigger className='m-4 ml-16 w-[60%]'>
          <SelectValue></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'derp 1'}>Derp 1</SelectItem>
          <SelectItem value={'derp 2'}>Derp 2</SelectItem>
          <SelectItem value={'derp 3'}>Derp 3</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
