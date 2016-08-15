'use babel';

import { SelectListView, TextEditorView } from 'atom-space-pen-views'

class InputWorkspaceNameView extends SelectListView {

  constructor (model, callback) {
    super();
    this.callback = callback;
    this.model = model;
  }

  initialize () {
    super.initialize();
  }

  getFilterKey () {
    return 'name';
  }

  viewForItem (item) {
    let element = document.createElement('li');
    element.textContent = item.name;
    return element;
  }

  show (panel) {
    this.panel = panel;

    if (this.panel.isVisible())
      return;

    console.log('Text Editor - Show');

    let items = Object.keys(this.model).map(x => {
      return {
        name: x,
        value: this.model[x]
      };
    });
    this.setItems(items);

    this.panel.show();
    this.storeFocusedElement();
    this.filterEditorView.focus();
  }

  close () {
    if (!this.panel.isVisible())
      return;

    console.log('Text Editor - Close');

    this.filterEditorView.setText('');
    this.restoreFocus();
    this.panel.hide();
  }

  confirmed (item) {
    console.log('Text Editor - Confirm');

    const result = item.name;
    this.callback(result);
    this.close();
  }

  cancelled () {
    console.log('Text Editor - Cancel');

    const result = this.getFilterQuery();

    this.callback(result);
    this.close();
  }
}

InputWorkspaceNameView.content = function () {
  return this.div({class: 'select-list'}, () => {
    this.subview('filterEditorView', new TextEditorView({
      mini: true,
      placeholderText: 'Enter workspace name..'
    }));
    this.div({class: 'error-message', outlet: 'error'});
    this.div({class: 'loading', outlet: 'loadingArea'}, () => {
      this.span({class: 'loading-message', outlet: 'loading'});
      this.span({class: 'badge', outlet: 'loadingBadge'});
    });
    this.ol({class: 'list-group', outlet: 'list'});
  });
}

export default InputWorkspaceNameView
