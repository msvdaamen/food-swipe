import AppPagination from '@/components/app-pagination';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUsers } from '@/features/user/api/get-users'
import { ManagerUserDialog, useManageUserDialogState } from '@/features/user/components/manage-user';
import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns';
import { useState } from 'react';

export const Route = createFileRoute('/_layout/users')({
  component: RouteComponent,
})

function RouteComponent() {
  const manageUserDialog = useManageUserDialogState();
    const [page, setPage] = useState(1);
  const { data, isPending, error } = useUsers({
    amount: 10,
    page: page,
    sort: 'id',
  });
    const loadingArr = Array(5).fill(null);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return  <>
    <div className="flex justify-end mb-2">
      <Button onClick={() => manageUserDialog.open()}>
        Create user
      </Button>
    </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? loadingArr.map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <div className="h-6 animate-pulse rounded bg-muted"></div>
                  </TableCell>
                </TableRow>
              ))
            : data.data.map((user) => (
                <TableRow key={user.id} onClick={() => manageUserDialog.open(user)}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.name}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(user.createdAt), "MM/dd/yyyy")}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
    <div className="flex justify-center">
      {isPending ? null : (
        <AppPagination
          currentPage={page}
          totalPages={data?.pagination.totalPages || 1}
          onPageChange={setPage}
        />
      )}
    </div>
    <ManagerUserDialog/>
  </>
}
