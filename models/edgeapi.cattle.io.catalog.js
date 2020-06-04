export default {
  availableActions() {
    const out = this._availableActions;

    return [
      {
        action:     'update',
        enabled:    true,
        icon:       'icon icon-fw icon-chevron-right',
        label:      '更新',
        total:      1,
      },
      ...out,
    ];
  },
  update() {
    return (resources = this) => {
      this.$commit('catalogs/showModelInfo', {
        isShow: true,
        id:     this.id
      }, { root: true });
    };
  },
  add() {

  }
};
