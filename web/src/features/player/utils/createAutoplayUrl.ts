import type { Vendors } from "../playerTypes";

export const createAutoplayUrl = (
  url: string,
  vendor: Vendors,
): string | null => {
  if (vendor === "youtube")
    return (url.includes("?") ? "&" : "?") + "autoplay=1";
  if (vendor === "soundcloud")
    return url.replace("auto_play=false", "auto_play=true");
  return null;
};
