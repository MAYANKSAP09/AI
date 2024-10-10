const cds = require("@sap/cds");

const getSpecificationHeaderData = async ( ) => {
    const authIssuer = {
        issuer: null,
        success: true
    };

    let service;

        service = await cds.connect.to("OnPremise");

        const response = await service.run("ProductSpecification?$filter=ProductSpecificationInternalID eq '19162'",{
            params: { 
                    $top: 10,   // Equivalent to limit 10
                    $skip: 0 ,   // Offset starts at 0
                    $expand: "to_ProdSpecAllergenCmpstnHeader,to_ProdSpecCmpstnHeader,to_ProdSpecDescription,to_ProdSpecLstgCmpstnHeader,to_ProdSpecNutrientCmpstnHdr,to_ProdSpecPropertyHeader,to_ProdSpecQltatvCmpstnHeader,to_ProdSpecQtytvCmpstnHeader,to_ProdSpecStdCmpstnHeader"
            }
        });

        console.log("Product Specifications:", response);
    
    //const responseOData =  await service.read("SpecificationHeaders").limit(3000, 3000);;
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