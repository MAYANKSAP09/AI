using { gramont.sap.llm as db } from '../db/schema';

service EmbeddingStorageService {
    entity DocumentChunk as projection on db.DocumentChunk excluding { embedding };
    entity SpecificationvecotrData as projection on db.SpecificationvecotrData excluding { embedding };

    function storeEmbeddings() returns String;
    function deleteEmbeddings() returns String;
     function saveSpecificationVector() returns String;
}