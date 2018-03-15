'use babel'

import {buildPaneMap} from './paneMap'
import {PANE, PANE_AXIS} from '../constants/pane'

export default class Workspace {
  async open (workspace) {
    if (!workspace) {
      return
    }

    atom.project.setPaths(workspace.projectPaths)
    const rootContainer = this.__getWorkspaceRootContainer()
    
    await this.__closeAllPanes(rootContainer)  
    
    if (this.__isOldClient(workspace)) {
      await this.__openTabs(workspace.tabs)
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
    if (workspaceName in model) {
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

  async __openPanes (panes) {
    if (!panes.length) {
      return
    }

    for (const i in panes) {
      const subPane = panes[i]
      const isLast = parseInt(i) === panes.length - 1

      if (subPane.type === PANE) {
        await this.__openFirstLayerPaneAxis(subPane, i, isLast)
      } else if (subPane.type === PANE_AXIS) {
        await this.__openPaneAxis(subPane)
      }
    }
  } 

  async __closeAllPanes (paneContainer) {
    const ref = paneContainer.getPanes()
    for (let i = 0; i < ref.length; i++) {
      const pane = ref[i]
      await pane.destroyItems()
    }

    await paneContainer.destroy()
  }

  async __openTabs (tabs) {
    for (const uri of tabs) {
      await atom.workspace.open(uri, {})
    }
  }

  async __openFirstLayerPaneAxis (paneAxis, i, isLast) {
    const orientation = paneAxis.data.orientation

    await this.__openPane(paneAxis, i)

    if (!isLast) {
      this.__splitPane(paneAxis, orientation)
    }
  }

  async __openPane (pane, paneIndex) {
    if (paneIndex === '0') {
      atom.workspace.paneForURI(pane.data.tabs[0])      
    }

    await this.__openTabs(pane.data.tabs)
  }

  async __openPaneAxis (paneAxis) {
    for (const i in paneAxis.data) {
      const subPane = paneAxis.data[i]

      if (subPane.type === PANE) {
        await this.__openPane(subPane, i)
      } else if (subPane.type === PANE_AXIS) {
        await this.__openPaneAxis(subPane)
      }

      const isLast = parseInt(i) === paneAxis.data.length - 1 
      if (!isLast) {
        const orientation = paneAxis.orientation
        this.__splitPane(paneAxis, orientation)
      }
    }
  }

  __splitPane (paneAxis, orientation) {
    const activePane = atom.workspace.getActivePane()
    this.__splitAndActivate(activePane, orientation, 'vertical')
  }

  __splitAndActivate (activePane, orientation, downSplitDirection) {
    const isSplitDown = orientation === downSplitDirection
    const newPane = isSplitDown ? activePane.splitDown() : activePane.splitRight()
    newPane.activate()
  }
}
