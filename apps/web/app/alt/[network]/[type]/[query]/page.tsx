import { FetchLoadArgs } from "../../../../../lib/utils";
import Table from "./table/component";

export default async function EntityPage({
    params,
  }: {
    params: FetchLoadArgs;
  }) {
    /**
     * For now, we will default to the table view
     */

    // @ts-expect-error Async Server Component
    return <Table resourcePath={params} />;
  }