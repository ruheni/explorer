import { InferGetServerSidePropsType } from "next";
import { GetServerSideProps } from "next";
import { Entity } from "service-manager/types/entity.type";
import { EntityPath, ValueSchemaType } from "service-manager";
import { getEntity } from "service-manager/types/network.type";
import {
  loadDynamicNetworks,
  ServiceManager,
} from "../../../../lib/service-manager";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import {
  TopBar,
  Header,
  RightPanel,
  EntityDetails,
  SearchInput,
  KeyValueList,
  Card,
  CardList,
  Table,
  ContentWindow,
} from "@modularcloud/design-system";
import Image from "next/image";
import useSWR from "swr";

import { CubesOff } from "@modularcloud/design-system";
import { getSearchOptions } from "../../../../lib/search-options";
import { Whitelabel } from "../../../../lib/whitelabel";
import { isSearchable } from "../../../../lib/search";
import Link from "next/link";
import Head from "next/head";
import Script from "next/script";

interface PanelProps {
  classes: string;
  id: string;
  metadata: { [key: string]: ValueSchemaType };
  img: string;
  context: {
    network: string;
    entityTypeName: string;
  };
}

const EntityPanel = ({ classes, id, metadata, context, img }: PanelProps) => (
  <RightPanel className={classes}>
    <EntityDetails
      iconType={<CubesOff />}
      type={context.entityTypeName}
      hash={id}
      network={img}
    />
    <KeyValueList
      header={`${context.entityTypeName} Information`}
      entries={Object.entries(metadata)}
    />
  </RightPanel>
);

export const getServerSideProps: GetServerSideProps<{
  entity: Entity;
  whitelabel?: string | null;
  searchOptions: any;
}> = async ({ params }) => {
  const { networkLabel, entityType, field, fieldValue } = params ?? {};
  if (
    typeof networkLabel !== "string" ||
    typeof entityType !== "string" ||
    typeof field !== "string" ||
    typeof fieldValue !== "string"
  ) {
    throw Error(
      `Misconfigured parameters: network=${networkLabel}, entityType=${entityType}, field=${field}. fieldValue=${fieldValue}`
    );
  }

  await loadDynamicNetworks();
  const network = ServiceManager.getNetwork(networkLabel);
  if (!network) {
    return {
      notFound: true,
    };
  }

  const entity = await getEntity(network, entityType, field, fieldValue);
  if (!entity) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      entity,
      whitelabel: Whitelabel,
      searchOptions: await getSearchOptions(),
    },
  };
};

function EntityPage({
  entity,
  whitelabel,
  searchOptions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const mode = "light";
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState(
    entity.context.entityTypeName === "Transaction" ||
      entity.context.entityTypeName === "Account"
      ? "cards"
      : "table"
  );
  const swrResponse = useSWR(
    "/api/associated#" + entity.uniqueIdentifier,
    (url) =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify(entity),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        if (data.length < 3) setView("cards");
      },
    }
  );
  const associated: EntityPath[] = swrResponse.data ?? []; // TODO validation
  const push = useCallback((path: string) => router.push(path), []);

  const isCelestiaEntity = entity.context.network.toLowerCase() === "mocha";
  const isDymensionEntity = !!entity.context.network
    .toLowerCase()
    .match(/(^hub$)|rollapp|dymension/);
  const isEclipseEntity = !isCelestiaEntity && !isDymensionEntity;

  let img = "";
  if (isCelestiaEntity) {
    img = "Celestia";
  }
  if (isDymensionEntity) {
    img = "Dymension";
  }
  if (isEclipseEntity) {
    img = "Eclipse";
  }

  let name = "Explorer";
  if (whitelabel === "celestia") {
    name = "Celestia";
  }
  if (whitelabel === "dymension") {
    name = "Dym";
  }
  if (whitelabel === "nautilus") {
    name = "Naut";
  }
  const shortId =
    entity.uniqueIdentifier.length > 6
      ? entity.uniqueIdentifier.substring(0, 6) + "..."
      : entity.uniqueIdentifier;

  return (
    <>
      <Head>
        <title>{`${entity.context.entityTypeName} (${shortId}) on ${
          entity.context.network === "RollAppX"
            ? "RollApp X"
            : entity.context.network
        } - ${name}${whitelabel ? "Scan" : ""}`}</title>
      </Head>
      {entity.context.network === "Triton" ? (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-WM976PHBGC"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-WM976PHBGC');
          `}
          </Script>
        </>
      ) : null}
      <div className="flex">
        <div className="grow">
          {associated ? (
            <ContentWindow paths={associated} router={push} />
          ) : null}
        </div>
        <EntityPanel
          classes="sticky top-0 hidden lg:flex"
          id={entity.uniqueIdentifier}
          metadata={entity.metadata}
          context={entity.context}
          img={img}
        />
      </div>
    </>
  );
}

export default EntityPage;
