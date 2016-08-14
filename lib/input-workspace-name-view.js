'use babel';

import { TextEditorView, View } from 'atom-space-pen-views'

class InputWorkspaceNameView extends View {

  constructor (callback) {
    super();
    this.callback = callback;
  }

  show (panel) {
    this.panel = panel;

    if (this.panel.isVisible())
      return;

    console.log('Text Editor - Show');
    this.setEventHandlers();

    this.panel.show();
    this.miniEditor.focus();
  }

  close () {
    if (!this.panel.isVisible())
      return;

    console.log('Text Editor - Close');

    this.miniEditor.setText('');
    this.panel.hide();
  }

  setEventHandlers () {
    this.on('core:confirm', this.confirm.bind(this));
    this.on('core:cancel', this.cancel.bind(this));

    this.on('blur', () => {
      console.log('Text Editor - Blur');
      this.callback();
    });
  }

  confirm () {
    console.log('Text Editor - Confirm');

    const result = this.miniEditor.getText();
    this.callback(result);
    this.close();
  }

  cancel () {
    this.callback(null);
    this.close();
  }
}

InputWorkspaceNameView.content = function () {
  return this.div({
    class: 'save-workspace-input-name'
  }, () => {
    this.subview('miniEditor', new TextEditorView({
      mini: true,
      placeholderText: 'Enter workspace name..'
    }));
  });
}

export default InputWorkspaceNameView
