<template>
  <v-container>
    <h1>{{item.title}}</h1>
    <v-card-text class="red--text"><v-icon class="pr-2 red--text">mdi-alert</v-icon>Please do not use browser refresh or browser back, it will make the data disappear.</v-card-text>
    <v-row>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6">
        <h2 class="ma-4">Contents Editor</h2>
        <quilleditor class="my-4" v-model="item.content" ref="myTextEditor" :options="editorOption" @change="onChange">
          <div id="toolbar" slot="toolbar">
            <select class="ql-header">
              <option value="2"></option>
              <option value="3"></option>
              <option value="4"></option>
              <option selected></option>
            </select>
            <span class="ql-formats"><button class="ql-script" value="sub"></button></span>
            <span class="ql-formats"><button class="ql-script" value="super"></button></span>
            <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
            <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
            <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
            <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
            <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
            <span class="ql-formats"><button type="button" class="ql-link"></button></span>
            <span class="ql-formats">
              <button type="button" @click="imgClick" style="outline:none">
                <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle
                      class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill"
                                                                              points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
              </button>
            </span>
            <span class="ql-formats"><button type="button" class="ql-video"></button></span>
          </div>
        </quilleditor>
        <v-text-field label="Path" :rules="required" hide-details="auto" :color="color" v-model="item.path" hint="This is the path of article image folder, if you change after input images, you need to add those images again"></v-text-field>
        <v-text-field label="Title" :rules="required" hide-details="auto" :color="color" v-model="item.title">></v-text-field>
        <v-textarea label="Description" :rules="required" value="" :color="color" rows="3" v-model="item.description">></v-textarea>
        <v-select label="Category" v-model="item.category" :items="obj.categories" item-text="name" item-value="index" :color="color"></v-select>
        <v-autocomplete  label="Tag" v-model="item.tag" :items="obj.tags" filled chips item-text="name" item-value="index" multiple :color="color">
          <template v-slot:selection="data" :color="color">
            <v-chip v-bind="data.item.attrs" :input-value="data.selected" close @click="data.select" @click:close="remove(data.item)">{{ data.item.name }}</v-chip>
          </template>
          <template v-slot:item="data" :color="color">
            <template v-if="typeof data.item !== 'object'">
              <v-list-item-content v-text="data.item.name" :color="color"></v-list-item-content>
            </template>
            <template v-else :color="color">
              <v-list-item-content :color="color"><v-list-item-title v-html="data.item.name"></v-list-item-title></v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
        <v-file-input label="Thumbnail" prepend-icon="mdi-camera" :color="color" @change="thumb" accept="image/*"></v-file-input>
        <v-btn min-width="120" color="green darken-1" dark @click="save">Save</v-btn>
        <v-btn min-width="120" class="ml-4" color="red darken-1" dark @click.native="drop()" v-bind:to="{ name: 'Home'}">Remove</v-btn>
      </v-col>        
      <v-col xs="12" sm="12" md="6" lg="6" xl="6">
        <h2 class="ma-4">Preview</h2>
        <v-card class="overflow-scroll previewArea" width="360" height="640">
          <v-card-title>{{item.title}}</v-card-title>
          <v-img class="white--text align-end" :src="item.thumbnail"></v-img>
          <v-card-subtitle class="pb-0"><v-icon class="pr-2">mdi-clock-outline</v-icon>{{item.updated}}<v-icon class="pl-6 pr-2">mdi-folder</v-icon>{{getCatName(item.category)}}</v-card-subtitle>
          <v-card-text class="text--primary">{{item.description}}</v-card-text>
          <div id="preview" class="content ql-editor" v-html="item.content"></div>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'

  export default {
    props:{
      obj: Object,
      now: String,
      aid: Number,
      value: {
        type: String
      },
      /* Upload Image Path */
      uploadUrl: {
        type: String,
        default: '/'
      },
      /* Upload Image File Name */
      fileName: {
        type: String,
        default: 'file'
      },
      maxUploadSize:{
        type:Number,
        default: 1024 * 1024 * 500
      }
    },
    data: () => ({
      color: 'grey lighten-3',
      required: [
        value => !!value || 'Required.'
      ],
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        }
      },
      overlay: false,
      index: '',
      item: [],
    }),
    methods: {
      thumb(e) {
        this.item.thumbnail = this.item.path + e.name
      },
      save: function() {
        this.loading = true
        // GA tag
        this.$ga.event('detailEvent', 'save', '<save>' + this.item.title , this.aid)
        this.$store.dispatch('changeItem', this.item)
        this.overlay = !this.overlay
      },
      /* Customize Editor */
      onChange() {
        this.$emit('input', this.item.content)
      },
      /* Select upload image */
      onFileChange(e) {
        var fileInput = e.target;
        if (fileInput.files.length === 0) {
          return
        }
        this.editor.focus();
        if (fileInput.files[0].size > this.maxUploadSize) {
          this.$alert('Image size need to be under 500KB', 'Image size too large', {
            confirmButtonText: 'OK',
            type: 'warning',
          })
        }
        let src = this.item.path + fileInput.files[0].name
        this.editor.insertEmbed(this.editor.getSelection().index, 'image', src)
      },
      /* Click to upload image */
      imgClick() {
        if (!this.uploadUrl) {
          console.log('no editor uploadUrl');
          return;
        }
        /* Create input file */
        var input = document.createElement('input');
        input.type = 'file';
        input.name = this.fileName;
        input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
        input.onchange = this.onFileChange;
        input.click()
      },
      remove (item) {
        const index = this.item.tag.indexOf(item.index)
        if (index >= 0) this.item.tag.splice(index, 1)
      },
      drop: function() {
        this.$store.dispatch('removeItem', this.item)
        // GA tag
        this.$ga.event('detailEvent', 'remove', '<remove>' + this.item.title , this.aid)
      },
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quill
      },
      getItem: function() {
        return function(aid) {
          return this.$store.getters.getItem(aid)
        }
      },
      getCatName: function() {
        return function(index) {
          return this.$store.getters.getCatName(index)
        }
      }
    },
    components: {
      'quilleditor': quillEditor
    },
    watch: {
      'value'(newVal) {
        if (this.editor) {
          if (newVal !== this.item.content) {
            this.item.content = newVal
          }
        }
      },
      overlay (val) {
        val && setTimeout(() => {
          this.overlay = false
        }, 2000)
      }
    },
    mounted() {
      this.item = this.getItem(this.aid)
      // GA tag
      this.$ga.page({
        page: '/detail/' + this.aid,
        title: '<Detail>' + this.item.title,
        location: window.location.href
      })
    }
  }
</script>
<style scoped>
.v-icon.v-icon {
  font-size:18px;
}
.ql-editor {
  overflow:visible!important;
}
.previewArea {
  color:#555!important;
  overflow-y:auto;
  margin:16px auto;
}
.previewArea h1 {
  font-size:20px!important;
}
.previewArea h2 {
  font-size:18px!important;
}
.previewArea h3 {
  font-size:16px!important;
}
.previewArea h4, .previewArea p, .previewArea li {
  font-size:14px!important;
}
.previewArea img {
  width:100%!important;
}
</style>