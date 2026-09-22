import { deleteTask, restoreTask } from './tasks.js';
import { render } from './render.js';
import { showToast } from './toast.js';

export function removeTaskWithUndo(id) {
  const result = deleteTask(id);
  if (!result) return;
  render();
  showToast('Task deleted.', {
    type: 'success',
    action: {
      label: 'Undo',
      onClick: () => {
        restoreTask(result.removed, result.index);
        render();
      },
    },
  });
}