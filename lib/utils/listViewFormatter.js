'use babel'

export const formatWorkspace = function (workspaceName) {
  return {
    name: workspaceName,
    value: this[workspaceName]
  }
}
  
export const formatWorkspaces = workspaces =>
  Object.keys(workspaces).map(formatWorkspace.bind(workspaces))
