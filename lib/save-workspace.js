'use babel';

import InputWorkspaceNameView from './input-workspace-name-view';
import RemoveWorkspaceView from './views/remove-workspace-view';
import { CompositeDisposable } from 'atom';
import OpenCommand from './commands/open';
import SaveCommand from './commands/save';
import RemoveCommand from './commands/remove';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.openCommand = new OpenCommand();
    this.saveCommand = new SaveCommand();
    this.removeCommand = new RemoveCommand();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-workspace:save': () => this.saveCommand.execute(),
      'save-workspace:open': () => this.openCommand.execute(),
      'save-workspace:remove': () => this.removeCommand.execute(),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },
};
