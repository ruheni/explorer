import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/lib/prisma";
import { Chain } from ".prisma/client";

export default async function GetAllChainList(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
      const chainList = await prisma.Chain.findMany();
      res.status(200).json(chainList);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
