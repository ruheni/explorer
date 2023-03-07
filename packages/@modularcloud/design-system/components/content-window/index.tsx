import { useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { EntityPath } from "service-manager";
import { Table } from "../table";

type Props = {
  paths: EntityPath[];
  router: any;
  multiHeight?: boolean;
};

// temp
const queryClient = new QueryClient();

export function ContentWindow(props: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-red-100 h-full">
        <Table {...props} />
      </div>
    </QueryClientProvider>
  );
}
