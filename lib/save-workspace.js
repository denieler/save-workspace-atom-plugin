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
    const inputWorkspaceNameView = new InputWorkspaceNameView(model, this.saveWorkspace.bind(this));
    const inputWorkspaceNameViewModalPanel = atom.workspace.addModalPanel({
      item: inputWorkspaceNameView,
      visible: false
    });
    inputWorkspaceNameView.show(inputWorkspaceNameViewModalPanel);
  },

  openCommandAction () {
    const model = atom.config.get('save-workspace-Workspaces');
    const selectSavedWorkspaceView = new SelectSavedWorkspaceView(model, this.openWorkspace.bind(this));
    const selectSavedWorkspaceViewModalPanel = atom.workspace.addModalPanel({
      item: selectSavedWorkspaceView,
      visible: false
    });
    selectSavedWorkspaceView.show(selectSavedWorkspaceViewModalPanel);
  },

  saveWorkspace (inputWorkspaceName) {
    if (inputWorkspaceName) {
      projectPaths = atom.project.getPaths();

      const panes = [];
      const pane = atom.workspace.paneContainer.getRoot();

      if (pane.children) {

        for (const subPane of pane.children) {
          panes.push(this.__savePaneTabs(subPane));
        }

      } else {
        panes.push(this.__savePaneTabs(pane));
      }

      const workspaceToSave = {
        'projectPaths': projectPaths,
        'panes': panes
      };

      let savedWorkspaces = atom.config.get('save-workspace-Workspaces');
      if (!savedWorkspaces) {
        savedWorkspaces = {}
      }
      savedWorkspaces[inputWorkspaceName] = workspaceToSave;
      atom.config.set('save-workspace-Workspaces', savedWorkspaces);
    }
  },

  __savePaneTabs (pane) {
    const tabs = [];

    for (const tab of pane.items) {
      tabs.push(tab.getURI());
    }

    return {
       tabs: tabs,
       orientation: pane.parent.orientation
     };
  },

  openWorkspace (workspace) {
    if (workspace) {
      atom.project.setPaths(workspace.projectPaths);

      const pane = atom.workspace.paneContainer.getRoot();
      if (pane.children) {
        for (const subPane of pane.children) {
          subPane.destroy();
        }
      } else {
        pane.destroy();
      }

      if (workspace.tabs) {
        this.__openTabs(workspace.tabs);
      } else {
        for (const subPaneIndex in workspace.panes) {
          const subPane = workspace.panes[subPaneIndex];
          this.__createPane(subPane, subPaneIndex);
        }
      }
    }
  },

  __openTabs (tabs) {
    for (const uri of tabs) {
      atom.workspace.open(uri, {});
    }
  },

  __createPane (pane, paneIndex) {

    if (paneIndex != 0 && pane.orientation) {
      const activePane = atom.workspace.paneContainer.getActivePane();
      const side = 'after';
      activePane.split(pane.orientation, side);
    }

    atom.workspace.paneForURI(pane.tabs[0]);
    this.__openTabs(pane.tabs);
  },
};
