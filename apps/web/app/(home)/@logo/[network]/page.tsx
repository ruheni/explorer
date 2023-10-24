import { notFound } from "next/navigation";
import { getAllNetworks, getSingleNetworkCached } from "~/lib/network";
import type { FetchLoadArgs } from "~/lib/shared-utils";
import { BigLogo } from "~/ui/big-logo";

interface Props {
  params: Pick<FetchLoadArgs, "network">;
}
export default async function NetworkLogo(props: Props) {
  const network = await getSingleNetworkCached(props.params.network);
  if (!network) notFound();

  return <BigLogo gradient1="linear-gradient(94deg, #6833FF 19.54%, #336CFF 75.56%, #33B6FF 93.7%)" gradient2="linear-gradient(314deg, #6833FF 15.63%, #336CFF 65.12%, #33B6FF 121.07%)" text={network.chainBrand} />;
}

export async function generateStaticParams() {
  const allNetworks = await getAllNetworks();
  return allNetworks.map((network) => ({ network: network.slug }));
}
