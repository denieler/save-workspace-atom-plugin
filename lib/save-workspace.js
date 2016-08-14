'use babel';

import InputWorkspaceNameView from './input-workspace-name-view';
import SelectSavedWorkspaceView from './select-saved-workspace-view';
import { CompositeDisposable } from 'atom';

export default {

  saveWorkspaceAtomPluginView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-workspace:save': () => this.saveCommandAction(),
      'save-workspace:open': () => this.openCommandAction()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {
    };
  },

  saveCommandAction () {
    console.log('Save Workspace Plugin - Save');

    const inputWorkspaceNameView = new InputWorkspaceNameView(this.saveWorkspace);
    const inputWorkspaceNameViewModalPanel = atom.workspace.addModalPanel({
      item: inputWorkspaceNameView,
      visible: false
    });
    inputWorkspaceNameView.show(inputWorkspaceNameViewModalPanel);
  },

  openCommandAction () {
    console.log('Save Workspace Plugin - Open');

    const model = atom.config.get('save-workspace-Workspaces');
    const selectSavedWorkspaceView = new SelectSavedWorkspaceView(model, this.openWorkspace);
    const selectSavedWorkspaceViewModalPanel = atom.workspace.addModalPanel({
      item: selectSavedWorkspaceView,
      visible: false
    });
    selectSavedWorkspaceView.show(selectSavedWorkspaceViewModalPanel);
  },

  saveWorkspace (inputWorkspaceName) {
    console.log('Save Workspace Plugin - Save callback');

    if (inputWorkspaceName) {
      projectPaths = atom.project.getPaths();

      const tabs = []
      for (const tab of atom.workspace.paneContainer.root.items) {
        tabs.push(tab.getURI());
      }

      const workspaceToSave = {
        'projectPaths': projectPaths,
        'tabs': tabs
      };

      let savedWorkspaces = atom.config.get('save-workspace-Workspaces');
      if (!savedWorkspaces) {
        savedWorkspaces = {}
      }
      savedWorkspaces[inputWorkspaceName] = workspaceToSave;
      atom.config.set('save-workspace-Workspaces', savedWorkspaces);
    } else {
      console.log('Save Workspace Plugin - Save cancel');
    }
  },

  openWorkspace (workspace) {
    if (workspace) {
      atom.project.setPaths(workspace.projectPaths);

      for (const uri of workspace.tabs) {
        atom.workspace.open(uri, {});
      }
    } else {
      console.log('Save Workspace Plugin - Open cancel');
    }
  },
};
