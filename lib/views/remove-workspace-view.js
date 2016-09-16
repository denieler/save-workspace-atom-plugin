'use babel';

import { SelectListView, TextEditorView } from 'atom-space-pen-views'

class RemoveWorkspaceView extends SelectListView {

  constructor (workspaces, callback) {
    super();
    this.callback = callback;
    this.workspaces = workspaces;
  }

  show (panel) {
    this.panel = panel;

    if (this.panel.isVisible())
      return;

    if (this.workspaces && Object.keys(this.workspaces).length > 0) {
      let items = formatWorkspacesListView(this.workspaces);
      this.setItems(items);
    } else {
      this.setItems([]);
    }

    this.panel.show();

    this.storeFocusedElement();
    this.filterEditorView.focus();
  }

  close () {
    if (!this.panel.isVisible())
      return;

    this.filterEditorView.setText('');

    this.restoreFocus();

    this.panel.hide();
  }

  confirmed (item) {
    const result = item.name;
    this.callback(result);
    this.close();
  }

  cancelled () {
    const result = this.getFilterQuery();

    if (result && result !== '') {
      this.callback(result);
      this.close();
    }
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

RemoveWorkspaceView.content = function () {
  return this.div({class: 'select-list'}, () => {
    this.subview('filterEditorView', new TextEditorView({
      mini: true,
      placeholderText: 'Enter workspace name to remove..'
    }));
    this.div({class: 'error-message', outlet: 'error'});
    this.div({class: 'loading', outlet: 'loadingArea'}, () => {
      this.span({class: 'loading-message', outlet: 'loading'});
      this.span({class: 'badge', outlet: 'loadingBadge'});
    });
    this.ol({class: 'list-group', outlet: 'list'});
  });
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

export default RemoveWorkspaceView
