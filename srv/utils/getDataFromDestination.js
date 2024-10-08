const cds = require("@sap/cds");

const getSpecificationHeaderData = async ( ) => {
    const authIssuer = {
        issuer: null,
        success: true
    };

    let service;

        service = await cds.connect.to("OnPremise", {
          
            destinationOptions: { // FIXME: How to ignore user JWT, if this method is triggered from OData context, and always use iss?
                iss: authIssuer.issuer // See https://sap.github.io/cloud-sdk/docs/js/features/connectivity/destinations#destination-lookup-without-a-json-web-token .
            }
        });
    
    const responseOData =  await service.read("SpecificationHeaders").limit(10, 0);;
    return responseOData;
}

const getSpecificationItemsData = async (path , filter ) => {
    const authIssuer = {
        issuer: null,
        success: true
    };

    let service;

        service = await cds.connect.to("OnPremise", {
          
            destinationOptions: { // FIXME: How to ignore user JWT, if this method is triggered from OData context, and always use iss?
                iss: authIssuer.issuer // See https://sap.github.io/cloud-sdk/docs/js/features/connectivity/destinations#destination-lookup-without-a-json-web-token .
            }
        });
    
    const responseOData =  await service.read(path).where(filter);
    return responseOData;
}

module.exports = {
    getSpecificationHeaderData,
    getSpecificationItemsData
}