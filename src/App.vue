<template>
<v-app>
  <v-card tile class="overflow-hidden" min-height="100vh" width="100vw">
    <v-app-bar :color="color" dark fixed app :clipped-left="clipped">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{siteName}}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer :clipped="clipped" v-model="drawer" enable-resize-watcher app dark>
      <!-- absolute bottom temporary -->
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="grey--text text--lighten-3">
          <v-list-item v-for="(item, index) in menu" :key="index" link :to="{name: item.name}">
            <v-list-item-icon><v-icon>{{ item.icon }}</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>{{ item.name }}</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view :obj="obj" :now="now"></router-view>
      </v-container>
    </v-main>
  </v-card>
  <v-card id="create">
    <v-speed-dial v-model="fab" direction="top" transition="slide-y-reverse-transition" bottom right open-on-hover>
      <template v-slot:activator>
        <v-btn v-model="fab" color="red darken-2" dark fab>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-file</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" @click="download">
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-card>
  </v-app>
</template>
<script>

  const today = new Date();
  const update = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes()
  export default {
    computed: {
      obj: {
        get () {
          return this.$store.state.obj
        },
        set(value) {
          this.$store.commit('changeData',value)
        }
      }
    },
    data: () => ({
      items: [],
      now: update,
      color: 'red darken-3',
      siteName: 'API Builder',
      menu: [
        {
          name: 'Home',
          path: '/',
          icon: 'mdi-home',
        },
        {
          name: 'Master',
          path: '/master',
          icon: 'mdi-cogs',
        },
        {
          name: 'New',
          path: 'new',
          icon: 'mdi-pencil-plus',
        },
        {
          name: 'Guide',
          path: '/guide',
          icon: 'mdi-book-open-blank-variant',
        }
      ],
      drawer: false,
      clipped: false,
      fab: false,
      group: null,
    }),
    methods: {
      download: function() {
        this.obj.update = update
        const output = this.obj
        const data = JSON.stringify(output)
        const blob = new Blob([data], {
          type: 'text/plain'
        })
        const e = document.createEvent('MouseEvents'),
          a = document.createElement('a');
        a.download = "data.json";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        // GA tag
        this.$ga.event('siteEvent', 'download', 'json', 1)
      }
    },
    watch: {
      group () {
        this.drawer = false
      },
    },
  }
</script>
<style>
  #create .v-speed-dial {
    position: absolute;
    bottom:30px;
  }
  #create .v-btn--floating {
    position: relative;
  }
  .previewArea img {
    width:100%!important;
  }
  .ql-container.ql-snow {
    border: 1px solid #ccc;
    max-height: 600px;
    overflow-y: auto;
}
.ql-container.ql-snow img {
  height:100px;
  width:auto;
}
</style>