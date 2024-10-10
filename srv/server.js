// FIXME: / can be accessed even without authentication turned on.
const process = require("process");
const cds = require("@sap/cds");
const cov2ap = require("@cap-js-community/odata-v2-adapter");


cds.on("bootstrap", (app) => { 
    app.use(cov2ap({
        plugin: true,
        path: 'v2'
    }))
});

module.exports = cds.server;
