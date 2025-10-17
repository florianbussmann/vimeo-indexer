<script lang="ts" generics="TData, TValue">
    import {
        type ColumnDef,
        type PaginationState,
        getCoreRowModel,
        getPaginationRowModel,
    } from "@tanstack/table-core";
    import {
        createSvelteTable,
        FlexRender,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Button } from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select/index.js";
    import ChevronsLeftIcon from "@lucide/svelte/icons/chevrons-left";
    import ChevronsRightIcon from "@lucide/svelte/icons/chevrons-right";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";

    type DataTableProps<TData, TValue> = {
        columns: ColumnDef<TData, TValue>[];
        data: TData[];
    };

    let { data, columns }: DataTableProps<TData, TValue> = $props();

    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        state: {
            get pagination() {
                return pagination;
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                pagination = updater(pagination);
            } else {
                pagination = updater;
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
</script>

<div>
    <div class="rounded-md border">
        <Table.Root>
            <Table.Header>
                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                    <Table.Row>
                        {#each headerGroup.headers as header (header.id)}
                            <Table.Head colspan={header.colSpan}>
                                {#if !header.isPlaceholder}
                                    <FlexRender
                                        content={header.column.columnDef.header}
                                        context={header.getContext()}
                                    />
                                {/if}
                            </Table.Head>
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Header>
            <Table.Body>
                {#each table.getRowModel().rows as row (row.id)}
                    <Table.Row data-state={row.getIsSelected() && "selected"}>
                        {#each row.getVisibleCells() as cell (cell.id)}
                            <Table.Cell>
                                <FlexRender
                                    content={cell.column.columnDef.cell}
                                    context={cell.getContext()}
                                />
                            </Table.Cell>
                        {/each}
                    </Table.Row>
                {:else}
                    <Table.Row>
                        <Table.Cell
                            colspan={columns.length}
                            class="h-24 text-center"
                        >
                            No results.
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
        <div class="flex items-center space-x-2">
            <p class="text-sm font-medium">Rows per page</p>
            <Select.Root
                allowDeselect={false}
                type="single"
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value: any) => {
                    table.setPageSize(Number(value));
                }}
            >
                <Select.Trigger class="h-8 w-[70px]">
                    {String(table.getState().pagination.pageSize)}
                </Select.Trigger>
                <Select.Content side="top">
                    {#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
                        <Select.Item value={`${pageSize}`}>
                            {pageSize}
                        </Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>
        <div
            class="flex w-[150px] items-center justify-center text-sm font-medium"
        >
            Page {table.getState().pagination.pageIndex + 1} of
            {table.getPageCount()}
        </div>
        <div class="flex items-center space-x-2">
            <Button
                variant="outline"
                class="hidden size-8 p-0 lg:flex"
                onclick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                <span class="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
            </Button>
            <Button
                variant="outline"
                class="size-8 p-0"
                onclick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <span class="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
            </Button>
            <Button
                variant="outline"
                class="size-8 p-0"
                onclick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <span class="sr-only">Go to next page</span>
                <ChevronRightIcon />
            </Button>
            <Button
                variant="outline"
                class="hidden size-8 p-0 lg:flex"
                onclick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                <span class="sr-only">Go to last page</span>
                <ChevronsRightIcon />
            </Button>
        </div>
    </div>
</div>
