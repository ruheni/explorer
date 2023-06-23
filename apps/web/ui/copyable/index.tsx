"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FetchLoadArgs } from "../../lib/utils";

type Props = {
  children?: React.ReactNode,
  value: string | number,
  link?: FetchLoadArgs,
}

export function CopyableValue({ value, children, link }: Props) {
  const router = useRouter();
  let displayedValue = <>{value}</>;
  if (children) {
    displayedValue = <>children</>;
  }

  useEffect(() => {
    if (link) {
      router.prefetch(`/${link.network}/${link.type}/${link.query}`);
    }
  }, [])

  function goToLink() {
    if (link) {
      router.push(`/${link.network}/${link.type}/${link.query}`);
    }
  }

  return <span className={clsx(link ? "border-b hover:border-dashed" : "border-dashed border-b border-b-white", "cursor-pointer text-night border-b-night hover:border-b-night-600 hover:text-night-600 hover:border-b border-b-night-500 mr-2")} onClick={(e) => {
    if (link && (e.ctrlKey || e.metaKey)) {
      goToLink();
    } else {
      navigator.clipboard.writeText(String(value));
    }
  }}>{displayedValue}</span>;
}
