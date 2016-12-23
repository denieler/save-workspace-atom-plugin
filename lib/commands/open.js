'use babel';

import SelectSavedWorkspaceView from './../select-saved-workspace-view';
import Workspace from './../models/workspace';

const WORKSPACES_PATH = 'save-workspace-Workspaces';

export default class Open {

  constructor () {
    this.workspace = new Workspace();
  }

  execute () {
    const model = atom.config.get(WORKSPACES_PATH);

    const selectSavedWorkspaceView = new SelectSavedWorkspaceView(model, (workspaceName) => {
      this.workspace.open(workspaceName);
    }.bind(this));
    const selectSavedWorkspaceViewModalPanel = atom.workspace.addModalPanel({
      item: selectSavedWorkspaceView,
      visible: false
    });

    selectSavedWorkspaceView.show(selectSavedWorkspaceViewModalPanel);
  }
}
