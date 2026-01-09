import { createFileRoute } from "@tanstack/react-router";
import { PropsWithoutRef, useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import AppPagination from "@/components/app-pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserStats } from "@/features/user/api/get-user-stats";
import { useUsers } from "@/features/user/api/get-users";

export const Route = createFileRoute("/_layout/activities/login-activity")({
  component: RouteComponent,
  context: () => ({
    breadcrumb: "Login Activity",
    path: "/activities/login-activity",
  }),
});

function RouteComponent() {
  const { data: stats, isLoading: isLoadingStats } = useUserStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <StatsCard
          loading={isLoadingStats}
          title="Total users"
          thisMonth={stats?.total || 0}
          lastMonth={stats?.totalLastMonth || 0}
          total={stats?.total || 0}
        />
        <StatsCard
          loading={isLoadingStats}
          title="Total users"
          thisMonth={stats?.total || 0}
          lastMonth={stats?.totalLastMonth || 0}
          total={stats?.total || 0}
        />
        <StatsCard
          loading={isLoadingStats}
          title="New users"
          thisMonth={stats?.new || 0}
          lastMonth={stats?.newLastMonth || 0}
          total={stats?.new || 0}
        />
      </div>

      <UsersTable />
    </div>
  );
}

function UsersTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isPending } = useUsers({
    amount: 10,
    page,
    sort: "id",
  });

  const loadingArr = Array(5).fill(null);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
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
              : data?.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(user.createdAt), "MM/dd/yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center">
        {isLoading ? null : (
          <AppPagination
            currentPage={page}
            totalPages={data?.pagination.totalPages || 1}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
}

type StatsCardProps = {
  title: string;
  thisMonth: number;
  lastMonth: number;
  total: number;
  loading: boolean;
};

function StatsCard(props: PropsWithoutRef<StatsCardProps>) {
  const { title, thisMonth, lastMonth, total, loading } = props;

  const percentage = useMemo<number>(() => {
    if (loading) return 0;

    if (lastMonth === 0) {
      return thisMonth > 0 ? 100 : 0;
    }

    return ((thisMonth - lastMonth) / lastMonth) * 100;
  }, [loading, thisMonth, lastMonth]);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <span className="text-sm text-muted-foreground">{title}</span>
          {loading ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex items-center">
              <span className="grow text-2xl font-medium">{total || 0}</span>
              <div
                className={`rounded-full border bg-background px-5 py-1.5 flex items-center ${
                  percentage < 0
                    ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-500"
                    : "border-green-600 text-green-600 dark:border-green-500 dark:text-green-500"
                }`}
              >
                {percentage > 0 ? (
                  <ArrowUp className="size-4" />
                ) : (
                  <ArrowDown className="size-4" />
                )}
                {Math.abs(percentage).toFixed(0)}%
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
