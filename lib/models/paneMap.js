'use babel';

import {PANE, PANE_AXIS} from '../constants/pane'

export const buildPaneMap =  (paneContainer) => {
    if (!paneContainer.children) {
      return [buildPane(paneContainer)]
    }

    return paneContainer.children.map(buildPane)
}

export const buildPane = (pane) => {
    if (pane.children) {
      return {
        type: PANE_AXIS,
        data: buildPaneMap(pane),
        orientation: pane.orientation
      }
    }

    return {
      type: PANE,
      data: formatPaneData(pane)
    }
  }

export const formatPaneData = (pane) => {
  const tabs = []

  for (const tab of pane.items) {
    tabs.push(tab.getURI())
  }

  return {
    tabs: tabs,
    orientation: pane.parent.orientation
  }
}
