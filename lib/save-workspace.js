'use babel';

import SaveWorkspaceAtomPluginView from './save-workspace-atom-plugin-view';
import { CompositeDisposable } from 'atom';

export default {

  saveWorkspaceAtomPluginView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    console.log('Save Workspace plugin');

    this.saveWorkspaceAtomPluginView = new SaveWorkspaceAtomPluginView(state.saveWorkspaceAtomPluginViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.saveWorkspaceAtomPluginView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-workspace-atom-plugin:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    console.log('Save Workspace plugin deactivate');
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.saveWorkspaceAtomPluginView.destroy();
  },

  serialize() {
    return {
      saveWorkspaceAtomPluginViewState: this.saveWorkspaceAtomPluginView.serialize()
    };
  },

  toggle() {
    console.log('SaveWorkspaceAtomPlugin was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
