module.exports = {
  defaultRlsUsing: '( owner_id = viewer_id() )',
  allRoleSets: [
    {
      name: 'graphile-visitor',
      dbOwnerRole: {
        roleName: 'app_owner',
        applicableRoles: []
      },
      dbAuthenticatorRole: {
        roleName: 'app_authenticator',
        applicableRoles: [ {roleName: 'app_visitor'}, {roleName: 'app_anonymous'} ]
      },
      dbUserRoles: [
        {
          roleName: 'app_visitor',
          applicableRoles: [ {roleName: 'app_anonymous'} ]
        },
        {
          roleName: 'app_anonymous',
          applicableRoles: []
        }    
      ],    
  },
    {
      name: 'multi-user',
      dbOwnerRole: {
        roleName: 'app_owner',
        applicableRoles: []
      },
      dbAuthenticatorRole: {
        roleName: 'app_authenticator',
        applicableRoles: [ {roleName: 'app_super_admin'}, {roleName: 'app_admin'}, {roleName: 'app_user'}, {roleName: 'app_anonymous'} ]
      },
      dbUserRoles: [
        {
          roleName: 'app_super_admin',
          applicableRoles: [ {roleName: 'app_admin'}, {roleName: 'app_user'}, {roleName: 'app_anonymous'} ]
        },
        {
          roleName: 'app_admin',
          applicableRoles: [ {roleName: 'app_user'}, {roleName: 'app_anonymous'} ]
        },
        {
          roleName: 'app_user',
          applicableRoles: [ {roleName: 'app_anonymous'} ]
        },
        {
          roleName: 'app_anonymous',
          applicableRoles: []
        }
      ]
    }
  ]
}
