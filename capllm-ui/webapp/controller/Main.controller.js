sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"], function (Controller, JSONModel) {
  "use strict";

  return Controller.extend("capllmui.controller.Main", {
    onInit: function () {},

    /**
     * @override
     */
    onAfterRendering: function () {
      const oModel = new JSONModel({
        data: [
          {
            name: "AI",
            text: "Hello, can I help you?",
            date: new Date(),
          },
        ],
      });

      this.getView().setModel(oModel, "aiModel");
    },

    onPost: function (oEvent) {
      const sQuery = oEvent.getParameter("value");
      const oModel = this.getView().getModel();
      this.getView().setBusy(true);

      this._insertMessage("User", sQuery);

      oModel.callFunction("/getRagResponse", {
        urlParameters: { userQuery: sQuery },
        method: "GET",
        success: function (oResult) {
          this._insertMessage("AI", oResult.getRagResponse.completion.content);
          this.getView().setBusy(false);
        }.bind(this),
        error: function (oError) {
          this._insertMessage("AI", oError.message);
          this.getView().setBusy(false);
        }.bind(this),
      });
    },

    _insertMessage: function (sName, sText) {
      const oAiModel = this.getView().getModel("aiModel");
      const oData = oAiModel.getProperty("/data");

      oData.push({ name: sName, text: sText, date: new Date() });

      oAiModel.setProperty("/data", oData);
    },
  });
});
