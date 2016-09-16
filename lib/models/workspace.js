'use babel';

export default class Workspace {
  open (workspace) {

    if (!workspace)
      return;

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

  save (workspaceName) {

    if (!workspaceName)
      return;

    const projectPaths = atom.project.getPaths();

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
    savedWorkspaces[workspaceName] = workspaceToSave;
    atom.config.set('save-workspace-Workspaces', savedWorkspaces);
  }

  remove (workspaceName) {
    let model = atom.config.get('save-workspace-Workspaces');
    if( workspaceName in model){
      delete model[workspaceName];
      atom.config.set('save-workspace-Workspaces', model);
    }
  }

  __openTabs (tabs) {
    for (const uri of tabs) {
      atom.workspace.open(uri, {});
    }
  }

  __createPane (pane, paneIndex) {

    if (paneIndex != 0 && pane.orientation) {
      const activePane = atom.workspace.paneContainer.getActivePane();
      const side = 'after';
      activePane.split(pane.orientation, side);
    }

    atom.workspace.paneForURI(pane.tabs[0]);
    this.__openTabs(pane.tabs);
  }

  __savePaneTabs (pane) {
    const tabs = [];

    for (const tab of pane.items) {
      tabs.push(tab.getURI());
    }

    return {
       tabs: tabs,
       orientation: pane.parent.orientation
     };
  }

}
