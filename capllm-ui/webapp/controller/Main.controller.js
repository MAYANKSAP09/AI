sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("capllmui.controller.Main", {
    onInit: function () {},

    /**
     * @override
     */
    onAfterRendering: function () {
      const oModel = this.getView().getModel();
    },
  });
});
