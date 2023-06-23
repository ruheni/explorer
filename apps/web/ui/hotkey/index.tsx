type Props = {
  hotkey: string;
  label: string;
}
export function Hotkey({ hotkey, label }: Props) {
  return (
    <div className="cursor-default flex gap-3">
      <div className="flex items-center justify-center px-[0.4375rem] min-w-6 h-6 text-hotkey bg-[rgba(8,6,21,0.05)] rounded-md border border-[rgba(8,6,21,0.1)] backdrop-blur-xs">
        {hotkey}
      </div>
      <div>{label}</div>
    </div>
  )
}
