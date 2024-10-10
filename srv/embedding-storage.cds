using { gramont.sap.llm as db } from '../db/schema';

service EmbeddingStorageService {
    entity DocumentChunk as projection on db.DocumentChunk excluding { embedding };
    entity Attachments as projection on db.Attachments ;
    entity Files as projection on db.Files ;
    entity SpecificationvecotrData as projection on db.SpecificationvecotrData excluding { VEC_VECTOR };
    function storeEmbeddings() returns String;
    action uploadPdf(file: LargeBinary) returns String;
    function deleteEmbeddings() returns String;
    function saveSpecificationVector() returns String;
    action importPdf(filePath: String) returns String;
}