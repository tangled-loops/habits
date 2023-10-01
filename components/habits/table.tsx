import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function HabitsTable() {
  return (
    <Table>
      <TableCaption>Tracking Habits.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Performed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key={1}>
          <TableCell className="font-medium">Brush Teeth</TableCell>
          <TableCell>High</TableCell>
          <TableCell>0</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}