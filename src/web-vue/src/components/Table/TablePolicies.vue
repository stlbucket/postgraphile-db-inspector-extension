<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="policies"
      class="elevation-1"
      :hide-default-footer="true"
    >
      <template slot="items" slot-scope="props">
        <!-- <td>{{ props.item.schemaName }}</td>
        <td>{{ props.item.tableName }}</td> -->
        <td>{{ props.item.policyName }}</td>
        <td>{{ props.item.roles }}</td>
        <td>{{ props.item.cmd }}</td>
        <td>{{ props.item.qual }}</td>
        <td>{{ props.item.withCheck }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  export default {
    name: 'TablePolicies',
    props: {
      policies: {
        type: Array,
        required: true
      }
    },
    methods: {
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    },
    data: () => ({
      headers: [
        {
          text: 'Policy Name',
          sortable: true,
          value: 'policyName'
        },
        {
          text: 'Roles',
          sortable: true,
          value: 'roles'
        },
        {
          text: 'Cmd',
          sortable: true,
          value: 'cmd'
        },
        {
          text: 'Qual',
          sortable: true,
          value: 'qual'
        },
        {
          text: 'With Check',
          sortable: true,
          value: 'withCheck'
        },
      ],
      pagination: {
        sortBy: 'constraintName',
        rowsPerPage: -1
      },
    })
  }
</script>

<style>

</style>
