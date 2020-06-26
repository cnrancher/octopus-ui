export default {
  stateDisplay() {
    let state = 'Active';
    let isActive = true;

    for (let i = 0; i < this.status?.conditions?.length; i++) {
      const condition = this.status.conditions[i];

      if (condition.status && condition.status === 'Unknown') {
        isActive = false;
      } else if (condition.status === 'False') {
        isActive = false;
      }
      state = `${ condition.type }:${ condition.status }`;
    }

    if (isActive) {
      state = 'Active';
    }

    return state;
  },

  stateBackground() {
    let state = 'Active';

    if (this.stateDisplay.includes('Unknown')) {
      state = 'unknown';
    } else if (this.stateDisplay.includes('False')) {
      state = 'error';
    }

    return this.stateColor(state).replace('text-', 'bg-');
  },
};
