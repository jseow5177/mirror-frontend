import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';

export default async function LogTable() {
  return (
    <Table aria-label='task-table'>
      <TableHeader>
        <TableColumn>Log</TableColumn>
      </TableHeader>
      <TableBody emptyContent='No logs to display.'>
        {[].map((_, i) => {
          return (
            <TableRow key={i}>
              <TableCell> </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
