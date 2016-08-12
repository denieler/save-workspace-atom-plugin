'use babel';

import SaveWorkspaceAtomPluginView from './save-workspace-view';
import { CompositeDisposable } from 'atom';

export default {

  saveWorkspaceAtomPluginView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.saveWorkspaceAtomPluginView = new SaveWorkspaceAtomPluginView(state.saveWorkspaceAtomPluginViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.saveWorkspaceAtomPluginView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-workspace:save': () => this.save()
    }));

    this.subscriptions.add(atom.commands.add('atom-open', {
      'save-workspace:open': () => this.open()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.saveWorkspaceAtomPluginView.destroy();
  },

  serialize() {
    return {
      saveWorkspaceAtomPluginViewState: this.saveWorkspaceAtomPluginView.serialize()
    };
  },

  save() {
    console.log('Save-Workspace: Save');
    console.log(atom);

    console.log(atom.workspace.eachEditor);
    console.log(atom.workspace.open);

    tabs = atom.workspace.paneContainer.root.items
    console.log(tabs);
    
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  open() {
    console.log('Save-Workspace: Open');
  }

};
