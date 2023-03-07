import { NextApiRequest, NextApiResponse } from "next";
import { EntityPathSchema, getEntity } from "service-manager";
import {
  loadDynamicNetworks,
  ServiceManager,
} from "../../../../../../../../lib/service-manager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { fieldValues, ...rest } = req.query;
    if (!Array.isArray(fieldValues)) {
      return res.status(400).end();
    }
    const { networkLabel, entityType, fieldName, fieldValue } =
      EntityPathSchema.parse({ fieldValue: fieldValues.join("/"), ...rest });
    await loadDynamicNetworks();
    const network = await ServiceManager.getNetwork(networkLabel);
    if (!network) {
      return res.status(404).end();
    }
    const entity = await getEntity(network, entityType, fieldName, fieldValue);
    if (!entity) {
      return res.status(404).end();
    }
    res.status(200).json(entity);
    res.end();
  } catch (e) {
    res.status(500).end();
  }
}
