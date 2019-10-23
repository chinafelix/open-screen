<template>
  <quill-editor
    v-model="content"
    :options="editorOption"
    ref="QuillEditor">
  </quill-editor>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor';

  export default {
    name: "vue-quill-editor-self",
    components: {
      quillEditor
    },
    data(){
      return {
        content: '',
        editorOption: {
          placeholder: '请输入',
          modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['image','video']
            ],
          },
          handlers:{
            image(value){
              console.log(value);
              if (value) {
                // 调用iview图片上传
                document.querySelector('.ivu-upload .ivu-btn').click();
              } else {
                this.quill.format('image', false);
              }
            }
          }
        },

      }
    },
    created() {
      quillEditor.mounted=function(){
        this.initialize();
        this.quill.container.style.minHeight="230px";
      }

    }
  }
</script>

<style scoped>

</style>
