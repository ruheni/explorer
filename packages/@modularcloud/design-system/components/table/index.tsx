import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  RowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Entity } from "service-manager/types/entity.type";
import { ElipsHorizOff } from "../../icons";
import clsx from "clsx";
import { Badge } from "../badge";
import { Status } from "../status";
import * as React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { EntityPath } from "service-manager";
import { useVirtualizer } from "@tanstack/react-virtual";

type Props = {
  paths: EntityPath[];
  router: any;
  multiHeight?: boolean;
};

type EntityColumn<T extends React.ReactNode> = {
  id: string;
  header?: string;
  hideOnXS?: boolean;
  showOnXS?: boolean;
  rightJustifyOnXS?: boolean;
  isPrimaryKey?: boolean;
  isIcon?: boolean;
  getCell: (entity: Entity) => T;
};

type TableSection = {
  rows: EntityPath[];
  columns: EntityColumn<any>[];
  label: string;
};

const EntityContext = React.createContext<Entity | null>(null);

function Type(entity: Entity) {
  console.log(JSON.stringify(entity));
  const associated = useQuery<EntityPath[]>(
    [
      "associated",
      "entity",
      entity.context.network,
      entity.context.entityTypeName,
      entity.uniqueIdentifierLabel,
      entity.uniqueIdentifier,
    ],
    async () => {
      return await axios({
        method: "POST",
        url: "/api/associated",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(entity),
      }).then((res) => res.data);
    }
  );
  const firstMessage = useQuery<Entity>(
    [
      "entity",
      associated.data?.[0]?.networkLabel,
      associated.data?.[0]?.entityType,
      associated.data?.[0]?.fieldName,
      associated.data?.[0]?.fieldValue,
    ],
    async () => {
      return await axios({
        url: `/api/entity/network/${associated.data?.[0]?.networkLabel}/type/${associated.data?.[0]?.entityType}/${associated.data?.[0]?.fieldName}/${associated.data?.[0]?.fieldValue}`,
      }).then((res) => res.data);
    },
    {
      enabled: !!associated.data?.[0],
    }
  );
  return (
    <Badge
      text={firstMessage.data?.uniqueIdentifier}
      extra={(associated.data?.length ?? 1) - 1}
    />
  );
}

type RowProps = {
  row: Row<EntityPath>;
  router: any;
  section: TableSection;
  minXSLeftPadding: number;
  minXSRightPadding: number;
  maxXSLeftPadding: number;
  maxXSRightPadding: number;
  size: number;
  start: number;
};

function Row({
  row,
  router,
  section,
  minXSLeftPadding,
  maxXSLeftPadding,
  maxXSRightPadding,
  minXSRightPadding,
  size,
  start,
}: RowProps) {
  const entity = useQuery<Entity>(
    [
      "entity",
      row.original.networkLabel,
      row.original.entityType,
      row.original.fieldName,
      row.original.fieldValue,
    ],
    async () => {
      return await axios({
        url: `/api/entity/network/${row.original.networkLabel}/type/${row.original.entityType}/${row.original.fieldName}/${row.original.fieldValue}`,
      }).then((res) => res.data);
    }
  );
  const original = entity.data;

  return (
    <EntityContext.Provider value={original ?? null}>
      <tr
        className="border-b border-b-[#F0F0F1] hover:bg-[#08061505] cursor-pointer h-[54px]"
        key={row.id}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${size}px`,
          transform: `translateY(${start}px)`,
        }}
        onClick={() =>
          original.context.network === "N/A"
            ? null
            : router(
                `/${original.context.network}/${original.context.entityTypeName}/${original.uniqueIdentifierLabel}/${original.uniqueIdentifier}`
              )
        }
      >
        {row.getVisibleCells().map((cell, index) => {
          const rules = section.columns[index];
          return (
            <td
              className={clsx(
                "py-3 px-1 text-mid-dark",
                rules.showOnXS && "xs:hidden",
                rules.hideOnXS && "max-xs:hidden",
                rules.rightJustifyOnXS && "max-xs:flex max-xs:justify-end",
                index === minXSLeftPadding && "xs:px-4 sm:px-6 md:px-8",
                index == minXSRightPadding && "xs:pr-4 sm:pr-6 md:pr-8",
                (index === maxXSLeftPadding || index == maxXSRightPadding) &&
                  "max-xs:px-4",
                !rules.isPrimaryKey &&
                  !rules.isIcon &&
                  "sm:w-[167px] md:w-[175px]",
                rules.isIcon && "w-5"
              )}
              key={cell.id}
            >
              <div
                className={clsx(rules.isPrimaryKey && "max-sm:w-20 truncate")}
              >
                {entity.isLoading ? "Loading..." : flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </td>
          );
        })}
      </tr>
    </EntityContext.Provider>
  );
}

function Cell(col: EntityColumn<any>) {
  const entity = React.useContext(EntityContext);
  React.useCallback(col.getCell, [entity]);
  if (!entity) return null;
  return <>{col.getCell(entity)}</>;
}

export function Table({ paths, router, multiHeight }: Props) {
  // temporarily before we have multi-entity tables
  if (!paths.length) {
    return null;
  }

  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  const section = React.useMemo(() => {
    const type = paths[0].entityType;
    const isNotCosmos = !paths[0].networkLabel
      .toLowerCase()
      .match(/(^hub$)|rollapp|dymension|mocha/);
    const filterData = paths.filter((entity) => entity.entityType === type);
    let section: TableSection;
    if (type === "Transaction") {
      if (isNotCosmos) {
        section = {
          rows: filterData,
          label: "Transactions",
          columns: [
            {
              id: "hash",
              header: "Transactions",
              isPrimaryKey: true,
              getCell: (entity: Entity) => entity.uniqueIdentifier,
            },
            {
              id: "menu",
              isIcon: true,
              getCell: (entity: Entity) => <ElipsHorizOff />,
            },
          ],
        };
      } else {
        section = {
          rows: filterData,
          label: "Transactions",
          columns: [
            {
              id: "icon",
              isIcon: true,
              showOnXS: true,
              getCell: (entity: Entity) => (
                <Status
                  status={Boolean(entity.metadata.Status.payload)}
                  mode="icon"
                />
              ),
            },
            {
              id: "hash",
              header: "Transactions",
              isPrimaryKey: true,
              getCell: (entity: Entity) => entity.uniqueIdentifier,
            },
            multiHeight
              ? {
                  id: "height",
                  header: "Height",
                  getCell: (entity: Entity) => entity.metadata.Height.payload,
                }
              : null,
            {
              id: "type",
              header: "Type",
              rightJustifyOnXS: true,
              getCell: (entity: Entity) => <Type {...entity} />,
            },
            {
              id: "status",
              header: "Status",
              hideOnXS: true,
              getCell: (entity: Entity) => (
                <Status status={Boolean(entity.metadata.Status.payload)} />
              ),
            },
            {
              id: "menu",
              isIcon: true,
              getCell: (entity: Entity) => <ElipsHorizOff />,
            },
          ].filter((notnull) => notnull) as EntityColumn<any>[],
        };
      }
    } else {
      section = {
        rows: filterData,
        label: type + "s", // TODO: handle plural better
        columns: [
          /*{
        id: "icon",
        isIcon: true,
        showOnXS: true,
        getCell: (entity: Entity) => <Status status={entity.metadata.status} mode="icon" />
      },*/
          {
            id: "id",
            header: type + "s", // TODO: handle plural better
            isPrimaryKey: true,
            getCell: (entity: Entity) => entity.uniqueIdentifier,
          },
          {
            id: "menu",
            isIcon: true,
            getCell: (entity: Entity) => <ElipsHorizOff />,
          },
        ],
      };
    }
    return section;
  }, [paths, multiHeight]);

  const columns = React.useMemo(
    () =>
      section.columns.map((col) => {
        const columnHelper = createColumnHelper<EntityPath>();
        return columnHelper.accessor("fieldName", {
          id: col.id,
          header: col.header ?? (() => null),
          cell: () => <Cell {...col} />,
        });
      }),
    [section.columns]
  );

  const table = useReactTable<EntityPath>({
    data: section.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel()
  console.log(rows.length, paths.length);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: React.useCallback(() => tableContainerRef.current, []),
    estimateSize: React.useCallback(() => 54, []),
    overscan: 10,
  })

  const maxXSLeftPadding = section.columns.findIndex((col) => !col.hideOnXS);
  const maxXSRightPadding =
    section.columns.length -
    1 -
    [...section.columns].reverse().findIndex((col) => !col.hideOnXS);
  const minXSLeftPadding = section.columns.findIndex((col) => !col.showOnXS);
  const minXSRightPadding =
    section.columns.length -
    1 -
    [...section.columns].reverse().findIndex((col) => !col.showOnXS);

  return (
    <div className="w-full overflow-x-hidden overflow-y-auto" ref={tableContainerRef}>
      {/*<div className="xs:hidden border-b border-b-night-100 h-10 font-bold w-full px-4 flex items-center">
        {section.label}
      </div>*/}
      <table className="text-left w-full" style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              className="max-xs:hidden border-b border-b-night-100 h-10 font-bold"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header, index) => {
                const rules = section.columns[index];
                return (
                  <th
                    className={clsx(
                      "px-1",
                      rules.showOnXS && "xs:hidden",
                      rules.hideOnXS && "max-xs:hidden",
                      rules.rightJustifyOnXS &&
                        "max-xs:flex max-xs:justify-end",
                      index === minXSLeftPadding && "xs:px-4 sm:px-6 md:px-8",
                      index == minXSRightPadding && "xs:pr-4 sm:pr-6 md:pr-8",
                      index === maxXSLeftPadding && "max-xs:pl-4",
                      index == maxXSRightPadding && "max-xs:pr-4",
                      !rules.isPrimaryKey &&
                        !rules.isIcon &&
                        "sm:w-[167px] md:w-[175px]",
                      rules.isIcon && "w-5"
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <Row
              row={rows[virtualRow.index]}
              router={router}
              minXSLeftPadding={minXSLeftPadding}
              maxXSLeftPadding={maxXSLeftPadding}
              minXSRightPadding={minXSRightPadding}
              maxXSRightPadding={maxXSRightPadding}
              section={section}
              size={virtualRow.size}
              start={virtualRow.start}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
