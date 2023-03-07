import { ValueSchemaType } from "./valueschema.type";

export type Entity = {
  uniqueIdentifierLabel: string;
  uniqueIdentifier: string;
  metadata: { [key: string]: ValueSchemaType };
  context: {
    network: string;
    entityTypeName: string;
  };
  raw: string;
};
