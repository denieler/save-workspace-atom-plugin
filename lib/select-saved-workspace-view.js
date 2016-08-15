'use babel';

import { SelectListView, View } from 'atom-space-pen-views'

class SelectSavedWorkspaceView extends SelectListView {

  constructor (model, callback) {
    super();
    this.callback = callback;
    this.model = model;
  }

  initialize () {
    super.initialize();
  }

  show (panel) {
    this.panel = panel;

    if (this.panel.isVisible())
      return;

    let items = Object.keys(this.model).map(x => {
      return {
        name: x,
        value: this.model[x]
      };
    });
    this.setItems(items);

    console.log('Select Workspace - Show');
    // this.setEventHandlers();

    this.panel.show();
    this.filterEditorView.focus();
  }

  close () {
    if (!this.panel.isVisible())
      return;

    console.log('Select Workspace - Close');

    this.panel.hide();
  }

  getFilterKey () {
    return 'name';
  }

  viewForItem (item) {
    let element = document.createElement('li');
    element.textContent = item.name;
    return element;
  }

  confirmed (item) {
    console.log('Select Workspace - Confirmed');

    this.callback(item.value);
    this.close();
  }

  cancelled () {
    console.log('Select Workspace - Cancelled');

    this.callback(null);
    this.close();
  }
}

export default SelectSavedWorkspaceView
