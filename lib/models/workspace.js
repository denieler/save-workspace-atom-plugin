'use babel';

export default class Workspace {
  open (workspace) {
    if (!workspace) {
      return;
    }

    atom.project.setPaths(workspace.projectPaths);

    {
      // TODO Refactor out
      const rootContainer = atom.workspace.paneContainer.getRoot();
      if (rootContainer.children) {
        for (const subPane of rootContainer.children) {
          subPane.destroy();
        }
      } else {
        rootContainer.destroy();
      }
    }

    for (const i in workspace.panes) {
      const subPane = workspace.panes[i];
      if (subPane.type === 'pane') {
        this.__createPane(subPane, i);
      } else if (subPane.type === 'paneAxis') {
        this.__createPaneAxis(subPane, i);
      }
    }
  }

  save (workspaceName) {
    if (!workspaceName) {
      return;
    }

    const projectPaths    = atom.project.getPaths();
    const rootContainer   = atom.workspace.paneContainer.getRoot();
    const panes           = this.__buildPaneMap(rootContainer);
    const workspaceToSave = { panes, projectPaths };

    debugger

    let savedWorkspaces = atom.config.get('save-workspace-Workspaces') || {};
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

  __buildPaneMap (pane) {
    if (!pane.children) {
      return [this.__buildPaneItem(pane)];
    }

    // TODO ES6
    const panes = [];

    for (const child of pane.children) {
      panes.push(this.__buildPaneItem(child));
    }

    return panes;
  }

  __buildPaneItem (pane) {
    if (pane.children) {
      return {
        type: 'paneAxis',
        data: this.__buildPaneMap(pane),
        orientation: pane.orientation
      };
    }

    return {
      type: 'pane',
      data: this.__savePaneTabs(pane)
    };
  }

  __openTabs (tabs) {
    for (const uri of tabs) {
      atom.workspace.open(uri, {});
    }
  }

  __createPane (pane, paneIndex) {
    let newPane;

    if (paneIndex != '0' && pane.data.orientation) {
      const activePane = atom.workspace.paneContainer.getActivePane();
      if (pane.data.orientation === 'horizontal') {
        newPane = activePane.splitRight();
      } else {
        newPane = activePane.splitDown();
      }
    }

    if (newPane) {
      newPane.activate();
    }

    atom.workspace.paneForURI(pane.data.tabs[0]);
    this.__openTabs(pane.data.tabs);
  }

  __createPaneAxis (paneAxis, paneIndex) {
    if (paneIndex !== '0') {
      this.__splitPane(paneAxis)
    }

    for (const i in paneAxis.data) {
      const subPane = paneAxis.data[i];
      if (subPane.type === 'pane') {
        this.__createPane(subPane, i);
      } else if (subPane.type === 'paneAxis') {
        this.__createPaneAxis(subPane, i)
      }
    }
  }

  __splitPane (paneAxis) {
    let newPane;
    const activePane = atom.workspace.paneContainer.getActivePane();

    if (paneAxis.orientation === 'horizontal') {
      newPane = activePane.splitRight();
    } else {
      newPane = activePane.splitDown();
    }

    if (newPane) {
      newPane.activate();
    }
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
