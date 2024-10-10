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

entity SpecificationvecotrData: cuid {
    VEC_TEXT: LargeString;
    VEC_META: LargeString;
    VEC_VECTOR: Vector;
}

entity Files: cuid, managed {
    @Core.MediaType: mediaType 
    @Core.ContentDisposition.Filename: fileName
    content: LargeBinary;
    @Core.IsMediaType: true
    mediaType: String;
    fileName: String;
    size: String;
}

entity Attachments : cuid {
    fileName         : String;
    @Core.MediaType: mimetype
    attachment : LargeBinary;
    @Core.IsMediaType
    mimetype   : String;
    size: String;
}