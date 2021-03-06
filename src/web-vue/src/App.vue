<template>
  <v-app id="inspire">
    <v-app-bar
      app
      clipped-left
    >
      <v-btn :class="refreshBtnClass" :color="refreshBtnColor" @click="refreshSchemata" :hidden="initializing">Refresh Schemata</v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title selectable v-text="title" @click="home"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="navigate('home')" :color="btnColor('home')">Project</v-btn>
      <v-btn @click="navigate('security-manager')" :color="btnColor('security-manager')" :disabled="initializing">Security Scripts</v-btn>
      <v-btn @click="navigate('search-view')" :color="btnColor('search-view')" :disabled="initializing">Function Search</v-btn>
      <v-btn @click="navigate('pg-lint')" :color="btnColor('pg-lint')" :disabled="initializing">PG-Lint</v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn @click="writeToDisk" :color="btnColor('writeToDisk')" :disabled="initializing">Write to Disk</v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-hover v-slot:default="{ hover }">
      <v-navigation-drawer
        v-model="drawer"
        app
        right
        :width="400"
        disable-route-watcher
      >
        <project-navigator
        ></project-navigator>
      </v-navigation-drawer>
    </v-hover>

    <v-content>
      <v-container
        justify-start
      >
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import dbIntrospection from '@/gql/query/dbIntrospection.graphql'
import ProjectNavigator from '@/components/Project/ProjectNavigator'
import writeArtifacts from '@/gql/mutation/writeArtifacts.graphql'

export default {
  name: 'App',
  props: {
    source: String,
  },
  components: { 
    ProjectNavigator
  },
  computed: {
    initializing () {
      return this.$store.state.initializing
    },
    currentRoute () {
      return this.$router.currentRoute
    },
    disableGraphileWorker () {
      return (this.$store.state.pgdbiOptions || {enableGraphileWorker: false}).enableGraphileWorker !== true
    },
    disableSqitch () {
      return (this.$store.state.pgdbiOptions || {enableSqitch: false}).enableSqitch !== true
    }
  },
  watch: {
    initializing () {
      this.setRefreshBtnClass()
    }
  },
  methods: {
    writeToDisk () {
      this.$store.dispatch('writeToDisk')
      .then(result => {
        alert(result)
      })
      .catch(e => {
        alert('ERROR')
        console.error(e)
      })
    },
    setRefreshBtnClass () {
      this.refreshBtnClass = this.initializing ? 'refreshBtnInitializing' : 'refreshBtn' 
      this.refreshBtnColor = this.initializing ? 'yellow darken-3' : 'blue-grey' 
    },
    refreshSchemata () {
      this.$loading(true)
      this.$apollo.query({
        query: dbIntrospection,
        fetchPolicy: 'network-only'
      })
      .then(result => {
        console.log(result.data)
        this.$store.dispatch('setManagedSchemata', {
           ...result.data.dbIntrospection,
            pgdbiOptions: {pgdbiOptions: result.data.pgdbiOptions},            
         })
        this.$store.commit('setIsDirty', false)
        this.$loading(false)
      })
      .catch(error => {
        this.$loading(false)
        console.error(error)
        alert(error.toString())
      })
    },
    btnColor (routeName) {
      if (routeName === 'writeToDisk') {
        return this.$store.state.isDirty ? 'red' : 'blue-grey'
      } else {
        return this.$router.currentRoute.name === routeName ? 'blue' : 'blue-grey'
      }
    },
    home () {
      this.$router.push({ name: 'home' })
      .catch(err => {})
    },
    settings () {
      this.$router.push({ name: 'settings' })
      .catch(err => {})
    },
    navigate (routeName) {
      this.$router.push({name: routeName})
      .catch(err => {})
    }
 },
  data () {
    return {
      expandNav: false,
      clipped: true,
      drawer: false,
      fixed: false,
      items: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'pg-db-inspector',
      refreshBtnClass: 'refreshBtn',
      refreshBtnColor: 'blue-grey'
    }
  },
  mounted() {
    this.setRefreshBtnClass()
  },
  created () {
    this.$vuetify.theme.dark = true
  },
}
</script>