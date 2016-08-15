'use babel';

import { SelectListView, View } from 'atom-space-pen-views'

class SelectSavedWorkspaceView extends SelectListView {

  constructor (savedWorkspaces, callback) {
    super();
    this.callback = callback;
    this.savedWorkspaces = savedWorkspaces;
  }

  initialize () {
    super.initialize();
  }

  show (panel) {
    this.panel = panel;

    if (this.panel.isVisible())
      return;

    let items = formatWorkspacesListView(this.savedWorkspaces);
    this.setItems(items);

    this.panel.show();

    this.storeFocusedElement();
    this.filterEditorView.focus();
  }

  close () {
    if (!this.panel.isVisible())
      return;

    this.restoreFocus();

    this.panel.hide();
  }

  confirmed (item) {
    this.callback(item.value);
    this.close();
  }

  cancelled () {
    this.callback(null);
    this.close();
  }

  getFilterKey () {
    return 'name';
  }

  viewForItem (item) {
    let li = document.createElement('li');
    li.textContent = item.name;
    return li;
  }
}

const formatWorkspaceListView = function (workspaceName) {
  return {
    name: workspaceName,
    value: this[workspaceName]
  };
};

const formatWorkspacesListView = function (savedWorkspaces) {
  return Object.keys(savedWorkspaces).map(formatWorkspaceListView.bind(savedWorkspaces));
};

export default SelectSavedWorkspaceView
