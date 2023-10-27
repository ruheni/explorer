import {
  createResolver,
  PendingException,
  ResolutionResponse,
} from "@modularcloud-resolver/core";
import * as Celestia from "@modularcloud-resolver/celestia";
import { z } from "zod";
import { Page, PageContext, Value } from "../../schemas/page";
import { addRoute, matchRoute, registerResolver } from "../../router";
import { PaginationContext } from "../../schemas/context";
import { registerResolvers } from "..";

type IntegrationResponse = ResolutionResponse | null;

export function createCelestiaIntegration(context: PageContext) {
  registerResolvers();

  // addRoute(["addresses", "[address]"], "svm-address-0.0.0", {
  //   enabled: true,
  //   regex: /[1-9A-HJ-NP-Za-km-z]{32,44}/,
  //   key: "address",
  //   name: "Address",
  // });
  // addRoute(
  //   ["addresses", "[address]", "transactions"],
  //   "svm-address-transactions-0.0.0",
  // );
  addRoute(["transactions"], "celestia-latest-transactions-0.0.0");

  addRoute(["transactions", "[hash]"], "celestia-page-transaction-0.0.0", {
    enabled: true,
    regex: /^(?:0x)?([a-fA-F0-9]{64})$/,
    key: "hash",
    name: "Transaction",
  });
  // addRoute(
  //   ["transactions", "[hash]", "messages"],
  //   "celestia-page-transaction-messages-0.0.0",
  // );
  addRoute(["blocks", "[hashOrHeight]"], "celestia-page-block-0.0.0", {
    enabled: true,
    regex: /^\d+$|^(?:0x)?[a-fA-F0-9]{64}$/,
    key: "hashOrHeight",
    name: "Block",
  });
  addRoute(["blocks"], "celestia-latest-blocks-0.0.0");
  // addRoute(
  //   ["blocks", "[heightOrHash]", "transactions"],
  //   "celestia-page-block-transactions-0.0.0",
  // );

  return {
    resolveRoute: async (
      path: string[],
      additionalContext = {},
    ): Promise<IntegrationResponse> => {
      const match = matchRoute(path);
      if (match) {
        return match.resolve((params, resolver) =>
          resolver({
            ...params,
            context: { ...context, ...additionalContext },
          }),
        );
      }
      return null;
    },
  };
}
