'use babel';

export default class SaveWorkspaceAtomPluginView {

  constructor(serializedState) {
    console.log('Save Workspace plugin constructor');

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('save-workspace-atom-plugin');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The SaveWorkspaceAtomPlugin package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
