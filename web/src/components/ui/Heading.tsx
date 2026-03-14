import type { ReactNode } from "react";

type HeadingProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2" | "h3";
  containerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export const Heading = ({
  title,
  subtitle,
  as = "h1",
  containerClassName = "",
  titleClassName = "",
  subtitleClassName = "",
}: HeadingProps) => {
  const TitleTag = as;

  return (
    <div className={["mb-8", containerClassName].join(" ").trim()}>
      <TitleTag
        className={[
          "text-4xl font-black text-white mb-2",
          titleClassName,
        ]
          .join(" ")
          .trim()}
      >
        {title}
      </TitleTag>

      {subtitle && (
        <p className={["text-gray-400", subtitleClassName].join(" ").trim()}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
