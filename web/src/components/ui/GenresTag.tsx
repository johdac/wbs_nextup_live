type WithGenres = { genres?: string[] };

export const GenresTag = ({ data }: { data: WithGenres }) => {
  return (
    <>
      <div>
        {data.genres?.length ? (
          data.genres.map((g) => (
            <span
              key={g}
              className="inline-flex w-fit rounded text-white px-2 py-0.5 bg-purple text-[10px] font-bold uppercase tracking-wider mr-2"
            >
              {g}
            </span>
          ))
        ) : (
          <span>-</span>
        )}
      </div>
    </>
  );
};
