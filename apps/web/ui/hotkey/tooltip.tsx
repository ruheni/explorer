"use client";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Hotkey } from '.';

type Props = {
  hotkey: string;
  label: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function HotkeyTooltip({ hotkey, label, children, side }: Props) {
  return <Tooltip.Provider delayDuration={0}>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side={side} avoidCollisions={true}>
          <Hotkey hotkey={hotkey} label={label} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
}
