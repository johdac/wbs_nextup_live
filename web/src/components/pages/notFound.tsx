import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center overflow-hidden bg-[#0d0d12] px-6 text-center font-sans">
      {/* The Purple Glow - Radial Gradient */}
      <div
        className="absolute top-[-10%] left-1/2 h-[600px] w-[800px] -translate-x-1/2 opacity-40 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
        }}
      />

      <div className="">
        <h1 className=" text-[12rem] font-extrabold leading-none tracking-tighter text-white/[0.03] md:text-[18rem]">
          404
        </h1>
        <div className="">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Page Not Found
          </h2>
          <p className="mx-auto mb-10 max-w-md text-lg text-zinc-400">
            It seems the page you're looking for doesn't exist. Let's get you
            back on track.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/">
              <button className="rounded-lg cursor-pointer bg-[#7c3aed] px-8 py-3 font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-transform hover:scale-105 active:scale-95">
                Return to Homepage
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
