<template>
  <v-container>
    <h1>{{ id }}</h1>
    <hr/>
    <v-tabs
      v-model="activeTab"
      dark
    >
      <v-tab
        key="cols"
        ripple
      >
        Columns
      </v-tab>
      <v-tab-item
        key="cols"
      >
        <v-card flat>
          <table-columns
            :tableInfo="tableInfo"
          ></table-columns>
        </v-card>
      </v-tab-item>

      <v-tab
        key="constraints-and-indices"
        ripple
      >
        Constraints and Indices
      </v-tab>
      <v-tab-item
        key="constraints-and-indices"
      >
        <v-card flat>
          <constraints-and-indices
            :tableSchema="tableSchema"
            :tableName="tableName"
          ></constraints-and-indices>
        </v-card>
      </v-tab-item>

      <v-tab
        key="tabletriggers"
        ripple
      >
        Triggers
      </v-tab>
      <v-tab-item
        key="tabletriggers"
      >
        <v-card flat>
          <table-triggers
            :triggers="tableTriggers"
          ></table-triggers>
        </v-card>
      </v-tab-item>

      <v-tab
        key="tablePolicy"
        ripple
      >
        Assigned Policy
      </v-tab>
      <v-tab-item
        key="tablePolicy"
      >
        <v-card flat>
          <table-policy-definition
            :policyId="tableInfo.policyDefinitionId"
            :table="tableInfo"
          ></table-policy-definition>
        </v-card>
      </v-tab-item>
      
      <v-tab
        key="tableScripts"
        ripple
      >
        Generated Scripts
      </v-tab>
      <v-tab-item
        key="tableScripts"
      >
        <v-card flat>
          <table-scripts
            :tableInfo="tableInfo"
          ></table-scripts>
        </v-card>
      </v-tab-item>
      
      <!--  <v-tab
        key="tablegrants"
        ripple
      >
        Table Grants
      </v-tab>
      <v-tab-item
        key="tablegrants"
      >
        <v-card flat>
          <table-grants
            :grants="tableGrants"
          ></table-grants>
        </v-card>
      </v-tab-item>

      <v-tab
        key="tablecolumngrants"
        ripple
      >
        Column Grants
      </v-tab>
      <v-tab-item
        key="tablecolumngrants"
      >
        <v-card flat>
          <table-column-grants
            :grants="tableColumnGrants"
          ></table-column-grants>
        </v-card>
      </v-tab-item>

      <v-tab
        key="tablepolicies"
        ripple
      >
        Policies
      </v-tab>
      <v-tab-item
        key="tablepolicies"
      >
        <v-card flat>
          <table-policies
            :policies="tablePolicies"
          ></table-policies>
        </v-card>
      </v-tab-item> -->

    </v-tabs>
  </v-container>
</template>

<script>
  // import tableById from '../../gql/query/tableById.graphql';
  import TableDetail from './TableDetail.vue'
  import TableColumns from './TableColumns.vue'
  import TableIndices from './TableIndices.vue'
  import TableConstraints from './TableConstraints.vue'
  import TableGrants from './TableGrants.vue'
  import TableColumnGrants from './TableColumnGrants.vue'
  import TablePolicies from './TablePolicies.vue'
  import TableTriggers from './Triggers/TableTriggers.vue'
  import TablePolicyDefinition from '../TableSecurity/Definition/TablePolicyDefinition'
  import ConstraintsAndIndices from '../ForeignKeyIndex/ConstraintsAndIndices'
  import TableScripts from './TableScripts'

  export default {
    name: 'Table',
    components: {
      TableDetail,
      TableColumns,
      TableConstraints,
      TableIndices,
      TableGrants,
      TableColumnGrants,
      TablePolicies,
      TableTriggers,
      TablePolicyDefinition,
      ConstraintsAndIndices,
      TableScripts
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    computed: {
      tableInfo () {
        const schema = this.$store.state.managedSchemata.find(s => s.schemaName === this.tableSchema)
        const table = schema.schemaTables.find(t => t.tableName === this.tableName)
        const tableSecurityPolicyId = this.$store.state.tablePolicyAssignments[this.id].policyDefinitionId

        return {
          ...table
          ,policyDefinitionId: tableSecurityPolicyId
        }
      },
      tableName () {
        return this.id.split('.')[1]
      },
      tableSchema () {
        return this.id.split('.')[0]
      },
      tableColumns () {
        return this.tableInfo.tableColumns || []
      },
      indices () {
        return this.tableInfo.indices || []
      },
      tableGrants () {
        return this.tableInfo.roleTableGrants || []
      },
      tableColumnGrants () {
        return this.tableInfo.roleColumnGrants || []
      },
      tablePolicies () {
        return this.tableInfo.policies || []
      },
      tableTriggers () {
        return this.tableInfo.triggers || []
      }
    },
    methods: {
    },
    data: () => ({
      activeTab: null,
      // tableInfo: {},
    }),
    beforeRouteUpdate (to, from, next) {
      // called when the route that renders this component has changed,
      // but this component is reused in the new route.
      // For example, for a route with dynamic params `/foo/:id`, when we
      // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
      // will be reused, and this hook will be called when that happens.
      // has access to `this` component instance.
      // console.log('to', to)
      // console.log('from', from)
      next()
    },
  }
</script>

<style>

</style>
