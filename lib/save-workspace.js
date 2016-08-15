'use babel';

import InputWorkspaceNameView from './input-workspace-name-view';
import SelectSavedWorkspaceView from './select-saved-workspace-view';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-workspace:save': () => this.saveCommandAction(),
      'save-workspace:open': () => this.openCommandAction()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  saveCommandAction () {
    const model = atom.config.get('save-workspace-Workspaces');
    const inputWorkspaceNameView = new InputWorkspaceNameView(model, this.saveWorkspace);
    const inputWorkspaceNameViewModalPanel = atom.workspace.addModalPanel({
      item: inputWorkspaceNameView,
      visible: false
    });
    inputWorkspaceNameView.show(inputWorkspaceNameViewModalPanel);
  },

  openCommandAction () {
    const model = atom.config.get('save-workspace-Workspaces');
    const selectSavedWorkspaceView = new SelectSavedWorkspaceView(model, this.openWorkspace);
    const selectSavedWorkspaceViewModalPanel = atom.workspace.addModalPanel({
      item: selectSavedWorkspaceView,
      visible: false
    });
    selectSavedWorkspaceView.show(selectSavedWorkspaceViewModalPanel);
  },

  saveWorkspace (inputWorkspaceName) {
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
    }
  },

  openWorkspace (workspace) {
    if (workspace) {
      atom.project.setPaths(workspace.projectPaths);

      let tabs = atom.workspace.paneContainer.root.items;
      for(let i = tabs.length - 1; i >= 0; i--) {
        tabs[i].destroy();
      }

      for (const uri of workspace.tabs) {
        atom.workspace.open(uri, {});
      }
    }
  },
};
