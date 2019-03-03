import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import policyHeaderTemplate from './templates/policyHeaderTemplate.js'
import policyFooterTemplate from './templates/policyFooterTemplate.js'
import roleTableGrantTemplate from './templates/roleTableGrantTemplate.js'

Vue.use(Vuex)


const defaultState = {
  schemaFilter: [],
  roleFilter: [],
  projectRoles: [],
  selectedRoleFamilies: [],
  selectedRole: [],
  familyPolicySets: [],
  policyHeaderTemplate: policyHeaderTemplate,
  policyFooterTemplate: policyFooterTemplate,
  roleTableGrantTemplate: roleTableGrantTemplate,
  appTenantFieldName: 'app_tenant_id',
  defaultRLSQual: '(auth_fn.app_user_has_access(app_tenant_id) = true)',
  policyTemplateNoRls: `
  --=================== {{schemaName}}.{{tableName}}  ===================
  
    --  REMOVE ALL SECURITY
    REVOKE ALL PRIVILEGES ON {{schemaName}}.{{tableName}} FROM PUBLIC;
    ALTER TABLE {{schemaName}}.{{tableName}} DISABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS all_{{tableName}}_app_user ON {{schemaName}}.{{tableName}};
    DROP POLICY IF EXISTS all_{{tableName}}_app_super_admin ON {{schemaName}}.{{tableName}};
    --||--
  
    ----------------  GRANTS ----------------
    GRANT select, update, delete ON TABLE {{schemaName}}.{{tableName}} TO app_user;
  
  --=================== {{schemaName}}.{{tableName}}  ===================
  `,
  policyTemplateRls: `
  --=================== {{schemaName}}.{{tableName}}  ===================
  
    --  REMOVE ALL SECURITY
    REVOKE ALL PRIVILEGES ON {{schemaName}}.{{tableName}} FROM PUBLIC;
    ALTER TABLE {{schemaName}}.{{tableName}} DISABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS all_{{tableName}}_app_user ON {{schemaName}}.{{tableName}};
    DROP POLICY IF EXISTS all_{{tableName}}_app_super_admin ON {{schemaName}}.{{tableName}};
    --||--
  
    ----------------  GRANTS ----------------
    GRANT select, update, delete ON TABLE {{schemaName}}.{{tableName}} TO app_user;
  
    ----------------  ENABLE ROW LEVEL SECURITY ----------------
    ALTER TABLE {{schemaName}}.{{tableName}} ENABLE ROW LEVEL SECURITY;
  
    ----------------  USER POLICY ----------------
    CREATE POLICY all_{{tableName}}_app_user ON {{schemaName}}.{{tableName}} FOR SELECT to app_user
    USING (app_tenant_id = soro.viewer_company_id());
  
    ----------------  SUPER ADMIN POLICY ----------------
    CREATE POLICY all_{{tableName}}_app_super_admin ON {{schemaName}}.{{tableName}} FOR SELECT to app_super_admin
    USING (1 = 1);
  
    ----------------  MAKE SURE THE TENANT ID FIELD IS INDEXED ----------------
    CREATE INDEX IF NOT EXISTS idx_{{tableName}}_app_tenant_id ON {{schemaName}}.{{tableName}}(app_tenant_id);
  
    --=================== {{schemaName}}.{{tableName}}  ===================
  `
  ,policies: []
}

function buildNewPolicy (name, roles) {
  return {
    id: (((new Date()).getTime() * 10000) + 621355968000000000),
    name: name,
    policyHeaderTemplate: policyHeaderTemplate,
    policyFooterTemplate: policyFooterTemplate,
    roleTableGrantTemplate: roleTableGrantTemplate,
    roleGrants: roles.reduce(
      (all, roleName) => {
        return {
          ...all,
          [roleName]: {
            select: 'DENIED',
            insert: 'DENIED',
            update: 'DENIED',
            delete: 'DENIED',
          }
        }
      }, {}
    ),
    rlsQualifiers: roles.reduce(
      (all, roleName) => {
        return {
          ...all,
          [roleName]: {
            select: '(app_tenant_id = auth_fn.current_app_tenant_id())',
            insert: '(app_tenant_id = auth_fn.current_app_tenant_id())',
            update: '(app_tenant_id = auth_fn.current_app_tenant_id())',
            delete: '(app_tenant_id = auth_fn.current_app_tenant_id())'
          }
        }
      }, {}
    )
  }
}

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    schemaFilter: defaultState.schemaFilter,
    roleFilter: defaultState.roleFilter,
    projectRoles: defaultState.projectRoles,
    selectedRoleFamilies: defaultState.selectedRoleFamilies,
    familyPolicySets: defaultState.familyPolicySets,
    appTenantFieldName: defaultState.appTenantFieldName,
    defaultRLSQual: defaultState.defaultRLSQual,
    policyTemplateNoRls: defaultState.policyTemplateNoRls,
    policyTemplateRls: defaultState.policyTemplateRls,
    policyHeaderTemplate: policyHeaderTemplate,
    policyFooterTemplate: policyFooterTemplate,
    roleTableGrantTemplate: roleTableGrantTemplate,
    policies: []
  },
  mutations: {
    initialize (state) {
      if (state.policies.length === 0) {
        state.policies = [buildNewPolicy('Default Policy', state.roleFilter)]
      }
    },
    resetDefaultState (state) {
      // state.schemaFilter = defaultState.schemaFilter
      // state.roleFilter = defaultState.roleFilter
      // state.selectedRoleFamilies = defaultState.selectedRoleFamilies
      // state.familyPolicySets = defaultState.familyPolicySets
      state.projectRoles = defaultState.projectRoles
      state.appTenantFieldName = defaultState.appTenantFieldName
      state.defaultRLSQual = defaultState.defaultRLSQual
      state.policyTemplateNoRls = defaultState.policyTemplateNoRls
      state.policyTemplateRls = defaultState.policyTemplateRls
      state.policies = [buildNewPolicy('Default Policy', state.roleFilter)]
    },
    schemaFilter (state, payload) {
      state.schemaFilter = payload.schemaFilter
    },
    roleFilter (state, payload) {
      state.roleFilter = payload.roleFilter
    },
    projectRoles (state, payload) {
      state.projectRoles = payload.projectRoles
    },
    selectedRoleFamilies (state, payload) {
      state.selectedRoleFamilies = payload.selectedRoleFamilies
    },
    familyPolicySets (state, payload) {
      state.familyPolicySets = payload.familyPolicySets
    },
    defaultRLSQual (state, payload) {
      state.defaultRLSQual = payload.defaultRLSQual
    },
    policyTemplateNoRls (state, payload) {
      state.policyTemplateNoRls = payload.policyTemplateNoRls
    },
    policyTemplateRls (state, payload) {
      state.policyTemplateRls = payload.policyTemplateRls
    },
    appTenantFieldName (state, payload) {
      state.appTenantFieldName = payload.appTenantFieldName
    },
    newPolicy(state, payload) {
      const existing = state.policies.find(p => p.name === payload.name)
      if (existing) {
        throw new Error('A policy with this name already exists')
      } else {
        const newPolicy = buildNewPolicy(payload.name, state.roleFilter)
  
        state.policies = [...state.policies, ...[newPolicy]].sort(function(a,b){ return a.id < b.id})
      }
    },
    savePolicy(state, payload) {
      const policies = state.policies.filter(p => p.name !== payload.policy.name)
      state.policies = [...policies, ...[payload.policy]].sort((a,b) => { return a.id - b.id })
    }
  },
  actions: {

  }
})
