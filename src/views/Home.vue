<template>
  <v-container>
    <h1>Home</h1>
    <v-card-text class="red--text"><v-icon class="pr-2 red--text">mdi-alert</v-icon>Please do not use browser refresh or browser back, it will make the data disappear.</v-card-text>
    <h2>Upload New Data</h2>
    <v-row>
      <v-col col="12">
        <v-file-input label="Upload json file" prepend-icon="mdi-file-sync" :color="color" @change="upload" hint="Please upload your own data.json to start"></v-file-input>
      </v-col>
    </v-row>
    <h2>Contents List</h2>
    <v-row>
      <v-col v-for="(article, index) in obj.items" xs="12" sm="6" md="4" lg="3" xl="2" :key="index">
        <v-hover v-slot:default="{ hover }">
        <v-card class="mx-auto" max-width="300" :to="{ name: 'Detail', params: { aid:article.aid, article:article }}">
          <v-img class="white--text align-end" height="120px" :src="article.thumbnail">
            <v-card-title class="twoLine">{{article.title}}</v-card-title>
          </v-img>
          <v-expand-transition>
          <div v-if="hover" class="d-flex transition-fast-in-fast-out red darken-2 v-card--reveal display-3 white--text" style="height: 100%;"><v-icon color="white" large>mdi-pencil</v-icon></div>
        </v-expand-transition>
          <v-card-subtitle class="pb-0 oneLine"><v-icon class="pr-2">mdi-clock-outline</v-icon>{{article.updated}}<v-icon class="pl-6 pr-2">mdi-folder</v-icon>{{getCatName(article.category)}}</v-card-subtitle>
          <v-card-text class="text--primary">
            <div class="threeLine my-2">{{article.description}}</div>
          </v-card-text>
        </v-card>
      </v-hover>
      </v-col>
    </v-row>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    color: 'grey lighten-3',
    required: [
      value => !!value || 'Required.'
    ],
    overlay: false,
  }),
  props:['obj','now'],
  computed: {
    getCatName: function() {
      return function(index) {
        return this.$store.getters.getCatName(index)
      }
    }
  },
  methods: {
    upload: function(file) {
      this.overlay = !this.overlay
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newObj = JSON.parse(e.target.result)
          this.$store.dispatch('changeData', newObj)
        };
      reader.readAsText(file);
      }
    },
  },
  watch: {
    overlay (val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 2000)
    },
  },
  mounted() {
    this.$ga.page({
      page: '/',
      title: 'Home',
      location: window.location.href
    })
  }
}
</script>
<style scoped>
.v-icon.v-icon {
  font-size:18px;
}
.oneLine, .twoLine, .threeLine {
  display:-webkit-box;
  overflow:hidden;
  -webkit-box-orient: vertical;
  -moz-box-orient:vertical;
}
.oneLine {
  -webkit-line-clamp:1;
}
.twoLine {
  -webkit-line-clamp:2;
  height:80px;
}
.threeLine {
  -webkit-line-clamp:3;
  height:64px;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .8;
  position: absolute;
  width: 100%;
}
</style>