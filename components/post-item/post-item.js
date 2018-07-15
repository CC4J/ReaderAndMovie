Component({
  properties: {
    item: {
      type: Object
    }
  },
  data: {
   
  },
  methods: {
    handleTap (event) {
      var postId = event.currentTarget.dataset.postId
      var eventDetail = { postId }
      this.triggerEvent('mytap', eventDetail, {})
    }
  }
})