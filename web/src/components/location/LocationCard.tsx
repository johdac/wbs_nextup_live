import { Link } from "react-router";
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

  return (
    <>
      <div
        key={location.id}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full pb-5"
      >
        <div className="relative w-full sm:w-30 sm:h-30 shrink-0 overflow-visible rounded-md">
          <div className="text-white h-full overflow-hidden rounded-md">
            <div className="w-full overflow-hidden rounded-xl border-0 object-cover">
              <img
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
              />
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="400"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          {/* <div className="gap-2"> */}
          <Link to={`/location/${location.id}`}>
            <h3 className="text-white text-xl transition-colors duration-100 hover:text-purple cursor-pointer">
              {location.name}
            </h3>
          </Link>

          <div className="text-gray">
            <p>{location.address}</p>
            <p>
              {location.zip} {location.city} {location.country}
            </p>
          </div>

          {/* </div> */}
        </div>
        <div className="pl-20">{actionSlot && <div>{actionSlot}</div>}</div>
      </div>
    </>
  );
};
