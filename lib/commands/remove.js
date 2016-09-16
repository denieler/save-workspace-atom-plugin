'use babel';

import RemoveWorkspaceView from './../views/remove-workspace-view';
import Workspace from './../models/workspace';

const WORKSPACES_PATH = 'save-workspace-Workspaces';

export default class Open {

  constructor () {
    this.workspace = new Workspace();
  }

  execute () {
    const model = atom.config.get(WORKSPACES_PATH);

    const selectRemoveWorkspaceView = new RemoveWorkspaceView(model, (workspaceName) => {
      this.workspace.remove(workspaceName);
    }.bind(this));
    const selectRemoveWorkspaceViewModalPanel = atom.workspace.addModalPanel({
      item: selectRemoveWorkspaceView,
      visible: false
    });

    selectRemoveWorkspaceView.show(selectRemoveWorkspaceViewModalPanel);
  }
}
