namespace gramont.sap.llm;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity DocumentChunk: cuid, managed {
    text_chunk: LargeString;
    metadata_column: LargeString;
    embedding: Vector(1536);
}

entity SpecificationvecotrData: cuid, managed {
    text_chunk: LargeString;
    metadata_column: LargeString;
    embedding: Vector(1536);
}

entity Files: cuid, managed {
    @Core.MediaType: mediaType @Core.ContentDisposition.Filename: fileName
    content: LargeBinary;
    @Core.IsMediaType: true
    mediaType: String;
    fileName: String;
    size: String;
}