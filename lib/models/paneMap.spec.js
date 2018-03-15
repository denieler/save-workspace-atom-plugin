import {buildPaneMap} from './paneMap'

import PaneContainerWithSplitPanels from '../../tests/fixtures/paneContainerWithSplitPanes'
import PaneContainerWithSimplePanelWithTabs from '../../tests/fixtures/paneContainerWithSimplePanelWithTabs'

it('should build pane map, when has complex split panes', () => {
  const resultMap = buildPaneMap(PaneContainerWithSplitPanels)

  const expectedMap = [{
    data: [{
      data: {
        orientation: 'horizontal',
        tabs: [
          'file1',
          'file2'
        ]
      },
      type: 'pane'
    },
    {
      data: {
        orientation: 'horizontal',
        tabs: [
          'file3'
        ]
      },
      type: 'pane'
    }],
    orientation: 'horizontal',
    type: 'paneAxis'
  },
  {
    data: {
      orientation: 'vertical',
      tabs: [
        'file4',
        'file5'
      ]
    },
    type: 'pane'
  }]

  expect(resultMap).toEqual(expectedMap)
})

it('should build pane map, when has simple pane with tabs', () => {
  const resultMap = buildPaneMap(PaneContainerWithSimplePanelWithTabs)
  const expectedMap = [{
    data: {
      orientation: undefined,
      tabs: [
        'file1',
        'file2',
        'file3'
      ],
    },
    type: 'pane'
  }]

  expect(resultMap).toEqual(expectedMap)
})
