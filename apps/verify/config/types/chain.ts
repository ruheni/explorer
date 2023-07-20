export type Chain = {
    name: string;
    chainId: number;
    shortName: string;
    network?: string;
    networkId: number;
    nativeCurrency: string;
    rpc: string[];
    faucets?: string[];
    infoURL?: string;
  };