const cds = require("@sap/cds");
const tableName = "GRAMONT_SAP_LLM_DOCUMENTCHUNK";
const embeddingColumn = "EMBEDDING";
const contentColumn = "TEXT_CHUNK";
//const userQuery = 'What are the services provided by NexGen Technologies?'
//const instructions = 'Return response in natural language with id'

//const altUserQuery = `Return me only specification header data together with respective values in list form that has granulometry target value of 50`
//const altInstructions = 'Return response in natural language with id'

module.exports = function () {
  this.on("getRagResponse", async () => {
    const { userQuery } = req.data;
    try {
      const vectorplugin = await cds.connect.to("cap-llm-plugin");
      //const temperature = 1;
      const ragResponse = await vectorplugin.getRagResponse(
        userQuery,
        tableName,
        embeddingColumn,
        contentColumn,
        `Locate and extract detailed technical specifications from this PDF document. Specifically, capture:
Specification ID: Any identifier or code related to the specification (e.g., Spec ID, part number, or document reference).
Header Data: The main section titles and headings that categorize the specifications (e.g., 'Specification Type', 'Specification Category', 'Nature', etc.).
Organize and return the extracted information by the specification ID, with corresponding header data in a structured format.`
        // Specification ID:
        // Specification Type:
        // Specification Category:
        // Substance Nature:`
      );
      return ragResponse;
    } catch (error) {
      console.log("Error while generating response for user query:", error);
      throw error;
    }
  });

  this.on("executeSimilaritySearch", async () => {
    const vectorplugin = await cds.connect.to("cap-llm-plugin");
    const embeddings = await vectorplugin.getEmbedding(altUserQuery);
    const similaritySearchResults = await vectorplugin.similaritySearch(tableName, embeddingColumn, contentColumn, embeddings, "L2DISTANCE", 3);
    return similaritySearchResults;
  });
};
