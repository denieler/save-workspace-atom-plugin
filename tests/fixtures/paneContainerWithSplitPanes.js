class TextEditor {
  constructor(file) {
    this.file = file
  }

  getURI() {
    return this.file
  }
}

export default {
  children: [
    {
      children: [{
        items: [
          new TextEditor('file1'),
          new TextEditor('file2')
        ]
      }, {
        items: [
          new TextEditor('file3')
        ]
      }],
      orientation: 'horizontal'
    },
    {
      items: [
        new TextEditor('file4'),
        new TextEditor('file5')
      ]
    }
  ],
  orientation: 'vertical'
}
