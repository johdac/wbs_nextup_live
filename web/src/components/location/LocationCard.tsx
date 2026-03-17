import { Link } from "react-router";
import { LinkIcon } from "lucide-react";
import type { Location } from "../../services/locationsApi";
import type { ReactNode } from "react";

export const LocationCard = ({
  location,
  actionSlot,
}: {
  location: Location;
  actionSlot?: ReactNode;
}) => {
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`;
  const websiteUrl = location.websiteUrl?.trim() ?? "";
  const hasWebsiteUrl = websiteUrl.length > 0;

  return (
    <>
      <div
        key={location.id}
        className="flex flex-wrap sm:flex-nowrap py-10 items-start text-white relative px-3 sm:px-0 gap-6"
      >
        <div className="relative w-full aspect-video sm:w-auto sm:h-40 sm:aspect-square md:aspect-4/3 shrink-0 overflow-visible rounded-md">
          <div className="text-white h-full overflow-hidden rounded-md">
            <div className="w-full md:aspect-4/3 overflow-hidden rounded-xl border-0 object-cover">
              {/* <img
                src={"/map.png"}
                alt={location.name}
                onError={(e) => {
                  const current = e.currentTarget;
                  if (!current.src.endsWith("map.png")) {
                    current.onerror = null;
                    current.src = "/map.png";
                  }
                }}
                className="hidden sm:flex w-full h-full object-cover"
              /> */}
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="240"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link to={`/location/${location.id}`}>
            <h3 className="my-1 sm:mt-0 text-2xl md:text-2xl lg:text-3xl font-bold text-yellow transition-colors hover:text-purple">
              {location.name}
            </h3>
          </Link>

          <div className="text-gray">
            <p>{location.address}</p>
            <p>
              {location.zip} {location.city} {location.country}
            </p>
          </div>
          {hasWebsiteUrl && (
            <div className="text-white flex flex-row gap-1 items-center">
              <LinkIcon className="w-5 h-5" />
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:underline"
              >
                Website
              </a>
              {websiteUrl}
            </div>
          )}
        </div>
        <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-4 absolute sm:static sm:bg-transparent bg-purple rounded-md right-0 top-[calc(-40px+50vw)] px-2 pt-1 pb-1.5 sm:p-0">
          {actionSlot && <div>{actionSlot}</div>}
        </div>
      </div>
    </>
  );
};
