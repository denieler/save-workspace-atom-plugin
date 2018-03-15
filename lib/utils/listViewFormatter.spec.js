'use babel'

import {formatWorkspaces} from './listViewFormatter'

it('shoud prepare empty list, when there are no workspaces', () => {
  const workspaces = {}

  const listViewItems = formatWorkspaces(workspaces)
  expect(listViewItems).toEqual([])
})

it('should prepare correctly list, when there are workspaces', () => {
  const workspaces = {
    'workspace_1': {
      panes: [],
      projectPaths: []
    },
    'workspace_2': {
      panes: [],
      projectPaths: []
    }
  }
  const expectedListView = [
    {
      name: 'workspace_1', 
      value: {
        panes: [],
        projectPaths: []
      }
    },
    {
      name: 'workspace_2',
      value: {
        panes: [],
        projectPaths: []
      }
    }
  ]

  const listViewItems = formatWorkspaces(workspaces)
  expect(listViewItems).toEqual(expectedListView)
})
