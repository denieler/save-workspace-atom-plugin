'use babel'

import { SelectListView } from 'atom-space-pen-views'
import * as listViewFormatter from '../utils/listViewFormatter'

class SelectSavedWorkspaceView extends SelectListView {

  constructor (savedWorkspaces, callback) {
    super()
    this.callback = callback
    this.savedWorkspaces = savedWorkspaces
  }

  initialize () {
    super.initialize()
  }

  show (panel) {
    this.panel = panel

    if (this.panel.isVisible())
      return

    let items = listViewFormatter.formatWorkspaces(this.savedWorkspaces)
    this.setItems(items)

    this.panel.show()

    this.storeFocusedElement()
    this.filterEditorView.focus()
  }

  close () {
    if (!this.panel.isVisible())
      return

    this.restoreFocus()

    this.panel.hide()
  }

  confirmed (item) {
    this.callback(item.value)
    this.close()
  }

  cancelled () {
    this.callback(null)
    this.close()
  }

  getFilterKey () {
    return 'name'
  }

  viewForItem (item) {
    let li = document.createElement('li')
    li.textContent = item.name
    return li
  }
}

export default SelectSavedWorkspaceView
