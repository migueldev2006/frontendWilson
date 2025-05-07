import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { Button, Chip, Input, Pagination } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import React, { useMemo, useState } from "react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => JSX.Element;
}

interface TableProps<T extends { key: string; estado?: boolean }> {
  data: T[];
  columns: TableColumn<T>[];
  onEdit?: (item: T) => void | boolean;
  onDelete?: (item: T) => void | undefined | Promise<void>;
  showEstado?: boolean;
  showActions?: boolean;
  searchValue?: (item: T) => string;
  extraHeaderContent?: React.ReactNode;
}

const Globaltable = <T extends { key: string; estado?: boolean }>({
  data,
  columns,
  onEdit,
  onDelete,
  showEstado = true,
  showActions = true,
  extraHeaderContent,
}: TableProps<T>) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    let result = data;

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) =>
        columns.some((column) => {
          const value = item[column.key];
          return value && value.toString().toLowerCase().includes(lowerSearch);
        })
      );
    }
    if (startDate || endDate) {
      result = result.filter((item) => {
        const itemDate = new Date((item as any).created_at);
        const valueDate = new Date((item as any).updated_at);
        if (startDate && new Date(startDate) > itemDate) return false;
        if (endDate && new Date(endDate) < itemDate) return false;
        if (startDate && new Date(startDate) > valueDate) return false;
        if (endDate && new Date(endDate) < valueDate) return false;
        return true;
      });
    }

    return result;
  }, [searchTerm, startDate, endDate, data, columns]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleSort = (key: keyof T) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        setSortConfig({ key, direction: "desc" });
      } else if (sortConfig.direction === "desc") {
        setSortConfig({ key: null, direction: null });
      } else {
        setSortConfig({ key, direction: "asc" });
      }
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue == null || bValue == null) return 0;

      return aValue > bValue
        ? sortConfig.direction === "asc"
          ? 1
          : -1
        : aValue < bValue
          ? sortConfig.direction === "asc"
            ? -1
            : 1
          : 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 mt-4 mb-4">
        {extraHeaderContent}
        <div className="flex">
          <Input
            className="mr-4 h-3 mt-1"
            isClearable
            label="Buscar"
            placeholder="Tipo de Busqueda..."
            radius="lg"
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
          />
          <div className="flex items-center">
          <h1 className="whitespace-nowrap">Buscar por fecha</h1>
            <Input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 text-sm dark:bg-zinc-900 dark:text-white"
            />
            <span>–</span>
            <Input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className=" px-2 py-1 text-sm dark:bg-zinc-900 dark:text-white"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="text-sm text-muted-foreground">{`Total ${data.length} elementos`}</div>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-muted-foreground">
            Filas por pagina:
          </label>
          <select
            className="bg-transparent text-sm dark:bg-zinc-900 text-black dark:text-white border-none focus:outline-none"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {[5, 10, 15, 20].map((value) => (
              <option
                key={value}
                value={value}
                className="dark:bg-zinc-900 text-black dark:text-white"
              >
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Table aria-label="Example table with dynamic content">
        <TableHeader
          columns={[...columns, { key: "actions", label: "Acciones" }]}
        >
          {(column) => (
            <TableColumn
              className="text-center"
              key={column.key.toString()}
              onClick={() => {
                if (column.key !== "actions") {
                  handleSort(column.key as keyof T);
                }
              }}
            >
              <div className="inline-flex items-center justify-center gap-1">
                <span>{column.label}</span>
                {column.key !== "actions" && (
                  <div className="flex flex-col ml-1">
                    <ChevronUpIcon
                      className={`h-3 w-3 ${
                        sortConfig.key === column.key &&
                        sortConfig.direction === "asc"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    <ChevronDownIcon
                      className={`h-3 w-3 ${
                        sortConfig.key === column.key &&
                        sortConfig.direction === "desc"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                )}
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedData}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => {
                // Encuentra la configuración de la columna
                return (
                  <TableCell className="text-center">
                    {columns.find((c) => c.key === columnKey)?.render
                      ? columns.find((c) => c.key === columnKey)!.render!(item)
                      : getKeyValue(item, columnKey)}

                    {showEstado && columnKey === "estado" && (
                      <Chip
                        className={`px-2 py-1 rounded ${
                          item.estado ? "text-green-500" : "text-red-500"
                        }`}
                        color={item.estado ? "success" : "danger"}
                        variant="flat"
                      >
                        {item.estado ? "Activo" : "Inactivo"}
                      </Chip>
                    )}

                    {showActions && columnKey === "actions" && (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => onEdit?.(item)}>
                          <PencilIcon className="h-5 w-5 text-blue-500" />
                        </button>
                        {onDelete && (
                          <button onClick={() => onDelete?.(item)}>
                            {item.estado ? (
                              <TrashIcon className="h-5 w-5 text-red-500" />
                            ) : (
                              <CheckIcon className="h-5 w-5 text-green-500" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-muted-foreground whitespace-nowrap pt-4 pl-2 pr-18">
          Pagina {page} de {totalPages}
        </div>
        <div className="flex justify-center w-full max-w-[300px] mx-auto">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={setPage}
            className="items-center"
          />
        </div>
        <div className="flex gap-2 ">
          <Button
            className=" dark:bg-zinc-900 text-black dark:text-white"
            isDisabled={page === 1}
            size="sm"
            variant="flat"
            onPress={handlePreviousPage}
          >
            Previous
          </Button>
          <Button
            className="dark:bg-zinc-900 text-black dark:text-white"
            isDisabled={page === totalPages}
            size="sm"
            variant="flat"
            onPress={handleNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};
export default Globaltable;
