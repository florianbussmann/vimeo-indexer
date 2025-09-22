<script lang="ts">
    import users from "$lib/data/users.json";
    import DataTable from "./data-table.svelte";
    import { columns } from "./columns.js";
</script>

<DataTable data={users} {columns} />
