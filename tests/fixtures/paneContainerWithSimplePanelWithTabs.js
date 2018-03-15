class TextEditor {
  constructor(file) {
    this.file = file
  }

  getURI() {
    return this.file
  }
}

export default {
  items: [
    new TextEditor('file1'),
    new TextEditor('file2'),
    new TextEditor('file3')
  ]
}
