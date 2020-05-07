export default {
  availableActions() {
    const out = this._availableActions;

    return [
      {
        action:  'upgrade',
        label:   '升级',
      },
      ...out,
    ];
  },
  upgrade() {
    return (resources = this) => {
      console.log(resources, this.currentRouter())
      this.currentRouter().push({ path: `/mqttManagement/edgeapi.cattle.io.catalog/create?app=${resources.spec.chart}&mode=edit&id=${resources.id}` });
    };
  },
};
