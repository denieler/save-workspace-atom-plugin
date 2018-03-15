'use babel';

import {buildPaneMap} from './paneMap'
import {PANE, PANE_AXIS} from '../constants/pane'

export default class Workspace {
  open (workspace) {
    if (!workspace) {
      return
    }

    atom.project.setPaths(workspace.projectPaths)
    const rootContainer = this.__getWorkspaceRootContainer()
    
    this.__closeAllPanes(rootContainer)  
    
    if (this.__isOldClient(workspace)) {
      this.__openTabs(workspace.tabs)
    } else {
      this.__openPanes(workspace.panes)
    }
  }

  save (workspaceName) {
    if (!workspaceName) {
      return
    }

    const projectPaths    = atom.project.getPaths()
    const rootContainer   = this.__getWorkspaceRootContainer()
    const panes           = buildPaneMap(rootContainer)
    const workspaceToSave = { panes, projectPaths }

    const savedWorkspaces = atom.config.get('save-workspace-Workspaces') || {}
    savedWorkspaces[workspaceName] = workspaceToSave

    atom.config.set('save-workspace-Workspaces', savedWorkspaces)
  }

  remove (workspaceName) {
    let model = atom.config.get('save-workspace-Workspaces')
    if ( workspaceName in model) {
      delete model[workspaceName]
      atom.config.set('save-workspace-Workspaces', model)
    }
  }

  __getWorkspaceRootContainer () {
    const centerWorkspace = atom.workspace.getCenter()
    const workspacePaneContainer = centerWorkspace.paneContainer

    const rootContainer = workspacePaneContainer.getRoot()

    return rootContainer
  }

  __isOldClient (workspace) {
    return workspace.tabs
  }

  __openPanes (panes) {
    for (const i in panes) {
      const subPane = panes[i]

      if (subPane.type === PANE) {
        this.__openPane(subPane, i)
      } else if (subPane.type === PANE_AXIS) {
        this.__openPaneAxis(subPane, i)
      }
    }
  } 

  __closeAllPanes (paneContainer) {
    const ref = paneContainer.getPanes()
    for (let i = 0; i < ref.length; i++) {
      const pane = ref[i]
      pane.destroyItems()
    }

    paneContainer.destroy()
  }

  __openTabs (tabs) {
    for (const uri of tabs) {
      atom.workspace.open(uri, {})
    }
  }

  __openPane (pane, paneIndex) {
    if (paneIndex != '0' && pane.data.orientation) {
      const activePane = atom.workspace.getActivePane()
      this.__splitAndActivate(activePane, pane.data.orientation, 'vertical')
    }

    atom.workspace.paneForURI(pane.data.tabs[0])
    this.__openTabs(pane.data.tabs)
  }

  __openPaneAxis (paneAxis, paneIndex) {
    if (paneIndex !== '0') {
      this.__splitPane(paneAxis)
    }

    for (const i in paneAxis.data) {
      const subPane = paneAxis.data[i]

      if (subPane.type === PANE) {
        this.__openPane(subPane, i)
      } else if (subPane.type === PANE_AXIS) {
        this.__openPaneAxis(subPane, i)
      }
    }
  }

  __splitPane (paneAxis) {
    const activePane = atom.workspace.getActivePane()
    this.__splitAndActivate(activePane, paneAxis.orientation, 'horizontal')
  }

  __splitAndActivate (activePane, orientation, downSplitDirection) {
    const isSplitDown = orientation === downSplitDirection
    const newPane = isSplitDown ? activePane.splitDown() : activePane.splitRight()
    newPane.activate()
  }
}
