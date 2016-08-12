'use babel';

import SaveWorkspaceAtomPlugin from '../lib/save-workspace-atom-plugin';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('SaveWorkspaceAtomPlugin', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('save-workspace-atom-plugin');
  });

  describe('when the save-workspace-atom-plugin:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.save-workspace-atom-plugin')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'save-workspace-atom-plugin:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.save-workspace-atom-plugin')).toExist();

        let saveWorkspaceAtomPluginElement = workspaceElement.querySelector('.save-workspace-atom-plugin');
        expect(saveWorkspaceAtomPluginElement).toExist();

        let saveWorkspaceAtomPluginPanel = atom.workspace.panelForItem(saveWorkspaceAtomPluginElement);
        expect(saveWorkspaceAtomPluginPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'save-workspace-atom-plugin:toggle');
        expect(saveWorkspaceAtomPluginPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.save-workspace-atom-plugin')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'save-workspace-atom-plugin:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let saveWorkspaceAtomPluginElement = workspaceElement.querySelector('.save-workspace-atom-plugin');
        expect(saveWorkspaceAtomPluginElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'save-workspace-atom-plugin:toggle');
        expect(saveWorkspaceAtomPluginElement).not.toBeVisible();
      });
    });
  });
});
