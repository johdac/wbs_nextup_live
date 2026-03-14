import type { LucideIcon } from "lucide-react";

type EventMetaItemProps = {
  heading: string;
  Icon: LucideIcon;
  children: React.ReactNode;
};

/**
 * We pass a component via the Icon prop, which is why it is capitalized. Also, since components
 * are JSX not JavaScript expressions we can use it directly without braces.
 */

export const EventMetaItem = ({
  heading,
  Icon,
  children,
}: EventMetaItemProps) => {
  return (
    <>
      <div>
        <div className="grid grid-cols-[auto_auto] pb-1 gap-1 items-center mb-8">
          <Icon className="mr-3 h-5 w-5 " />
          <div className="text-lg uppercase font-black">{heading}</div>
          <div className=""></div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
