'use babel'

import Workspace from './../models/workspace'

const WORKSPACES_PATH = 'save-workspace-Workspaces'

export default class SaveAndOpen {
  constructor (saveCommand, openCommand) {
    this.workspace = new Workspace()
    this.saveCommand = saveCommand
    this.openCommand = openCommand
  }

  async execute () {
    const model = atom.config.get(WORKSPACES_PATH)

    const currentPathsString = atom.project.getPaths().sort().join()

    const existingProject = Object.entries(model).reduce((acc, [name, project]) => {
      if (!acc) {
        const projectPathsString = project.projectPaths.sort().join()
        acc = projectPathsString === currentPathsString ? name : false
      }

      return acc
    }, false)

    if (existingProject) {
      this.workspace.save(existingProject)
    } else {
      await this.saveCommand.execute()
    }

    this.openCommand.execute()
  }
}