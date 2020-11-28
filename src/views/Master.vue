<template>
  <v-container>
    <h1>Master Editor</h1>
    <v-card-text class="red--text"><v-icon class="pr-2 red--text">mdi-alert</v-icon>Please do not use browser refresh or browser back, it will make the data disappear.</v-card-text>
    <h2>Default Path</h2>
    <v-row>
      <v-col col="12">
        <v-text-field class="px-2" label="Default Path" :rules="required" hide-details="auto" :color="color" :value="obj.path" hint="This is only the default path for image folder, you can have different path for each article"></v-text-field>
      </v-col>
    </v-row>
    <v-divider light class="my-4"></v-divider>
    <v-row>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6">
        <h2>Categories</h2>
        <v-row v-for="category in obj.categories" :key="category.index">
          <v-col xs="10" sm="10" md="10" lg="10" xl="10">
            <v-text-field class="px-2" label="Category" :rules="required" hide-details="auto" :color="color" v-model="category.name"></v-text-field>
          </v-col>
          <v-col xs="2" sm="2" md="2" lg="2" xl="2" class="pt-8 px-0" @click="removeCategory(category.index)">
            <v-icon>mdi-minus-circle</v-icon>
          </v-col>
        </v-row>
        <v-btn min-width="210" color="grey darken-1 ma-4" dark @click="addCategory">Add a new category</v-btn>
      </v-col>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6">
        <h2>Tags</h2>
        <v-row v-for="tag in obj.tags" :key="tag.index">
          <v-col xs="10" sm="10" md="10" lg="10" xl="10">
            <v-text-field class="px-2" label="Tag" :rules="required" hide-details="auto" :color="color" v-model="tag.name"></v-text-field>
          </v-col>
          <v-col xs="2" sm="2" md="2" lg="2" xl="2" class="pt-8 px-0" @click="removeTag(tag.index)">
            <v-icon>mdi-minus-circle</v-icon>
          </v-col>
        </v-row>
        <v-btn min-width="210" color="grey darken-1 ma-4" dark @click="addTag">Add a new tag</v-btn>
      </v-col>
    </v-row>
    <v-divider light class="my-4"></v-divider>
    <v-btn min-width="120" color="green darken-1 ma-4" dark @click="save">Save</v-btn>
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
    props:['obj','now','catList'],
    methods: {
      save: function() {
        this.loading = true
        // GA tag
        this.$ga.event('masterEvent', 'save', '<save>master' , 1)
        const newCategories = []
        const newTags = []
        for (let i = 0; i < this.obj.categories.length; i++) {
          if (this.obj.categories[i].name != "") {
            newCategories.push(this.categories[i])
          }
        }
        for (let i = 0; i < this.obj.tags.length; i++) {
          if (this.obj.tags[i].name != "") {
            newTags.push(this.tags[i])
          }
        }
        this.obj.categories = newCategories
        this.obj.tags = newTags
        this.$store.dispatch('changeData', this.obj)
        this.overlay = !this.overlay
      },
      addCategory: function() {
        const newItem = {
          index: this.obj.categories[this.obj.categories.length - 1].index + 1,
          name: ''
        }
        this.obj.categories.push(newItem)
      },
      addTag: function() {
        const newItem = {
          index: this.obj.tags[this.obj.tags.length - 1].index + 1,
          name: ''
        }
        this.obj.tags.push(newItem)
      },
      removeCategory: function(targetIndex) {
        this.obj.categories.splice(targetIndex-1,1)
      },
      removeTag: function(targetIndex) {
        this.obj.tags.splice(targetIndex-1,1)
      }
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
        page: '/master',
        title: 'Mater',
        location: window.location.href
      })
    }
  }
</script>
<style scoped>

</style>