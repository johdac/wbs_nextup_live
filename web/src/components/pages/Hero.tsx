export const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="max-w-8xl mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="space-y-6">
          <h1 className="text-7xl font-black leading-[1] tracking-tight uppercase text-white">
            Find your next
            <br />
            live show
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink via-orange to-yellow">
              as a playlist
            </span>
          </h1>
          <p className="text-gray-400 max-w-md text-lg leading-relaxed">
            NextUp Live turns upcoming shows into playlists you can actually
            listen to. Discover bands, venues, and nights out that match your
            taste — before you buy tickets.
          </p>

          <div className="flex gap-4 pt-4">
            <button className="bg-gradient-to-r from-pink to-yellow text-black font-bold px-8 py-4 rounded-md uppercase text-sm tracking-widest">
              Find shows near me
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-md uppercase text-sm font-bold tracking-widest hover:bg-white hover:text-black transition">
              For bands
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <img src="hero.webp" alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
};
