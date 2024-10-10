const cds = require('@sap/cds')
const { INSERT, DELETE, SELECT } = cds.ql
const { PDFLoader } = require('langchain/document_loaders/fs/pdf')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const path = require('path')
const fs = require('fs')
const pdf = require('pdf-parse');
const { getSpecificationHeaderData,getSpecificationItemsData } = require("./utils/getDataFromDestination.js");
const XLSX = require('xlsx');
const { Document } = require('langchain/document');
  
// Helper method to convert embeddings to buffer for insertion
let array2VectorBuffer = (data) => {
  const sizeFloat = 4
  const sizeDimensions = 4
  const bufferSize = data.length * sizeFloat + sizeDimensions

  const buffer = Buffer.allocUnsafe(bufferSize)
  // write size into buffer
  buffer.writeUInt32LE(data.length, 0)
  data.forEach((value, index) => {
    buffer.writeFloatLE(value, index * sizeFloat + sizeDimensions);
  })
  return buffer
}

// Helper method to delete file if it already exists
let deleteIfExists = (filePath) => {
    try {
        fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
            console.log('File does not exist')
            } else {
            console.error('Error deleting file:', err)
            }
        } else {
            console.log('File deleted successfully')
        }
        })
    } catch (unlinkErr) {
        console.error('Error occurred while attempting to delete file:', unlinkErr)
    }
}


async function vectorizeText(text) {
  // Assuming the CAP LLM Plugin provides a method to vectorize text
  const llmResponse = await cds.services.yourLLMService.vectorize({ text });
  return llmResponse.vector; // Adjust according to the LLM service response structure
};


async function loadXml(filePath) {
// Read the Excel file
const workbook = XLSX.readFile(filePath);
const sheetNames = workbook.SheetNames;

const documents = []; 

// Loop through all sheets
for (const sheetName of sheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Loop through each row in the sheet
    for (const row of data) {
        const content = row.join(' '); // Convert the row into a string
        documents.push(
            new Document({
                pageContent: content, // Set row data as the document content
                metadata: { sheet: sheetName }, // Optionally, store metadata such as sheet name
            })
        );
    }
}

return documents;
}

module.exports = function() {

 
 
       

  this.on('storeEmbeddings', async (req) => {
    try {
      const vectorPlugin = await cds.connect.to('cap-llm-plugin')
      const { DocumentChunk } = this.entities
      let textChunkEntries = []
      console.log(__dirname)
     // const xData = loadXml('db/data/r.xlsx')
      const loader = new PDFLoader(path.resolve('db/data/4.pdf'))
      const document =  await loader.load();

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 5000,
        chunkOverlap: 1000,
        addStartIndex: true
      })
        
      const textChunks = await splitter.splitDocuments(document)
      console.log(`Documents split into ${textChunks.length} chunks.`)

      console.log("Generating the vector embeddings for the text chunks.")
      const destinationName = "GENERATIVE_AI_HUB";
      // For each text chunk generate the embeddings
      for (const chunk of textChunks) {


        const embedding = await vectorPlugin.getEmbedding(chunk.pageContent);
        const entry = {
          "text_chunk": chunk.pageContent,
          "metadata_column": loader.filePath,
          "embedding": array2VectorBuffer(embedding)
        }
       
        textChunkEntries.push(entry)
      }

      console.log("Inserting text chunks with embeddings into db.")
      // Insert the text chunk with embeddings into db
      const insertStatus = await INSERT.into(DocumentChunk).entries(textChunkEntries)
      if (!insertStatus) {
        throw new Error("Insertion of text chunks into db failed!")
      }
      return `Embeddings stored successfully to db.`
    } catch (error) {
      // Handle any errors that occur during the execution
      console.log('Error while generating and storing vector embeddings:', error)
      throw error
    }
})

this.on('saveSpecificationVector', async (req) => {
  try {

    const srcSpecFilter1 = {
      SpecificationIntId: {in: ['00000000000000705708']}
  };
    const specificationHeader = await getSpecificationHeaderData(srcSpecFilter1);
  //   const aSpecifications = specificationHeader.map(item => item.SpecificationIntId);
  //   const srcSpecFilter = {
  //     SpecificationIntId: {in: aSpecifications}
  // };
  // let aspecificationMaterial = []
  // for(i = 0; i < aSpecifications.length ; i++){
  //   const srcSpecFilter = {
  //     SpecificationIntId: {in: [aSpecifications[i]]}
  // };
  // var  specificationMaterial = await getSpecificationItemsData("SpecificationMaterials",srcSpecFilter);
  // if(specificationMaterial.length > 0){
  //   aspecificationMaterial.push(...specificationHeader)
  // }
  // }
  //const specificationMaterial = await getSpecificationItemsData("SpecificationMaterials",srcSpecFilter);
  // const SpecificationAllergenComps = await getSpecificationItemsData("SpecificationAllergenComps",srcSpecFilter);
  // const SpecificationDietComps =await getSpecificationItemsData("SpecificationDietComps",srcSpecFilter);
  // const SpecificationGmoComps = await getSpecificationItemsData("SpecificationGmoComps",srcSpecFilter);
  // const SpecificationRelComps =await getSpecificationItemsData("SpecificationRelComps",srcSpecFilter);
  // const SpecificationIdentifiers = await getSpecificationItemsData("SpecificationIdentifiers",srcSpecFilter);


    const name = 83498216
    // const vectorPlugin = await cds.connect.to('cap-llm-plugin')
    // const { DocumentChunk } = this.entities
    // let textChunkEntries = []
    // console.log(__dirname)
    
    // const loader = new TextLoader(path.resolve('db/data/gramont.txt'))
    // const document = await loader.load()

    // const splitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 500,
    //   chunkOverlap: 0,
    //   addStartIndex: true
    // })
      
    // const textChunks = await splitter.splitDocuments(document)
    // console.log(`Documents split into ${textChunks.length} chunks.`)

    // console.log("Generating the vector embeddings for the text chunks.")
    // const destinationName = "GENERATIVE_AI_HUB";
    // // For each text chunk generate the embeddings
    // for (const chunk of textChunks) {


    //   const embedding = await vectorPlugin.getEmbedding(chunk.pageContent);
    //   const entry = {
    //     "text_chunk": chunk.pageContent,
    //     "metadata_column": loader.filePath,
    //     "embedding": array2VectorBuffer(embedding)
    //   }
     
    //   textChunkEntries.push(entry)
    // }

    // console.log("Inserting text chunks with embeddings into db.")
    // // Insert the text chunk with embeddings into db
    // const insertStatus = await INSERT.into(DocumentChunk).entries(textChunkEntries)
    // if (!insertStatus) {
    //   throw new Error("Insertion of text chunks into db failed!")
    // }
    // return `Embeddings stored successfully to db.`
  } catch (error) {
    // Handle any errors that occur during the execution
    console.log('Error while generating and storing vector embeddings:', error)
    throw error
  }
})

  this.on ('deleteEmbeddings', async (req) => {
    try {
      // Delete any previous records in the table
      const { DocumentChunk } = this.entities
      await DELETE.from(DocumentChunk)
      return "Success!"
    }
    catch (error) {
      // Handle any errors that occur during the execution
      console.log('Error while deleting the embeddings content in db:', error)
      throw error
    }
  })

  this.on('importPdf', async (req) => {
    const { filePath } = req.data; // Get file path from the request
    try {
        // Read the PDF file
        const pdfBuffer = await fs.promises.readFile(filePath);
        
        // Extract text from PDF
        const pdfData = await pdf(pdfBuffer);
        const pdfText = pdfData.text;

        // Vectorize text using CAP LLM Plugin
        const vectorData = await vectorizeText(pdfText);

        // Store vector data in database
        await cds.run(INSERT.into('your.VectorEntity').entries({ vector: vectorData }));

        return { message: 'PDF processed and vectorized successfully' };
    } catch (error) {
        console.error('Error processing PDF:', error);
        req.error(500, 'Failed to process PDF: ' + error.message);
    }
});
};

