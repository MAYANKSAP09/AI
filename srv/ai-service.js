const cds = require('@sap/cds')
const tableName = 'GRAMONT_SAP_LLM_DOCUMENTCHUNK'
const embeddingColumn = 'EMBEDDING'
const contentColumn = 'TEXT_CHUNK'
const userQuery = 'What are the services provided by NexGen Technologies?'
const instructions = 'Return the result in json format. Display the keys, the services in a table form.'

const altUserQuery = 'What are the services provided by Gramont?'
const altInstructions = 'Return the result in json format. Display the dollar rate and consultant level.'

module.exports = function() {
    this.on('getRagResponse', async () => {
        try {
            const vectorplugin = await cds.connect.to('cap-llm-plugin')
            const ragResponse = await vectorplugin.getRagResponse(
                altUserQuery,
                tableName,
                embeddingColumn,
                contentColumn,
                "Return the response as you are the CEO of Gramont"
            )
            return ragResponse
        } catch (error) {
            console.log('Error while generating response for user query:', error)
            throw error;
        }
    })

    this.on('executeSimilaritySearch', async () => {
        const vectorplugin = await cds.connect.to('cap-llm-plugin')
        const embeddings = await vectorplugin.getEmbedding(userQuery)
        const similaritySearchResults = await vectorplugin.similaritySearch(
            tableName,
            embeddingColumn,
            contentColumn,
            embeddings,
            'L2DISTANCE',
            3
        )
        return similaritySearchResults
    })
}