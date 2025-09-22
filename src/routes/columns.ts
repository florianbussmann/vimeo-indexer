import type { ColumnDef } from "@tanstack/table-core";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
    id: number;
    name: string;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
];