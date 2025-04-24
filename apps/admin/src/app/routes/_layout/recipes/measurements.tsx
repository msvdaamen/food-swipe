import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PencilIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateMeasurementDialog } from "@/features/measurement/components/create-measurement.dialog";
import { UpdateMeasurementDialog } from "@/features/measurement/components/update-measurement.dialog";
import { useMeasurements } from "@/features/measurement/api/get-measurements";
import { useDeleteMeasurement } from "@/features/measurement/api/delete-measurement";

export const Route = createFileRoute("/_layout/recipes/measurements")({
  component: RouteComponent,
  context: () => ({
    breadcrumb: "Measurements",
  }),
});

function RouteComponent() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<
    number | null
  >(null);

  const { data, isError, error, isPending } = useMeasurements();
  const deleteMeasurement = useDeleteMeasurement();
  
  const openCreateMeasurementDialog = () => {
    setIsCreateOpen(true);
  };

  const openUpdateMeasurementDialog = (id: number) => {
    setIsUpdateOpen(true);
    setSelectedMeasurementId(id);
  };

  const closeUpdateMeasurementDialog = () => {
    setIsUpdateOpen(false);
    setSelectedMeasurementId(null);
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const filteredMeasurements = data.filter((measurement) =>
    measurement.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="mb-4 w-64 relative">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-8"
        />
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>

      <div className="mb-2 flex justify-end">
        <Button size="sm" onClick={openCreateMeasurementDialog}>
          Add measurement
        </Button>
      </div>

      <div className="table-container rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-1/2">Name</TableHead>
              <TableHead className="w-1/2">Abbreviation</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending
              ? [1, 2, 3, 4, 5].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}>
                      <div className="h-6 animate-pulse rounded bg-muted"></div>
                    </TableCell>
                  </TableRow>
                ))
              : filteredMeasurements.map((measurement) => (
                  <TableRow key={measurement.id}>
                    <TableCell>{measurement.name}</TableCell>
                    <TableCell>{measurement.abbreviation}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            openUpdateMeasurementDialog(measurement.id)
                          }
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            deleteMeasurement.mutate(measurement.id)
                          }
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <CreateMeasurementDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <UpdateMeasurementDialog
        isOpen={isUpdateOpen}
        onClose={closeUpdateMeasurementDialog}
        measurementId={selectedMeasurementId!}
      />
    </>
  );
}
