'use babel';

import InputWorkspaceNameView from './../input-workspace-name-view';
import Workspace from './../models/workspace';

const WORKSPACES_PATH = 'save-workspace-Workspaces';

export default class Save {

  constructor () {
    this.workspace = new Workspace();
  }

  execute () {
    const model = atom.config.get(WORKSPACES_PATH);

    const inputWorkspaceNameView = new InputWorkspaceNameView(model, (workspaceName) => {
      this.workspace.save(workspaceName);
    }.bind(this));
    const inputWorkspaceNameViewModalPanel = atom.workspace.addModalPanel({
      item: inputWorkspaceNameView,
      visible: false
    });

    inputWorkspaceNameView.show(inputWorkspaceNameViewModalPanel);
  }
}
