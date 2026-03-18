import EventList from "../events/EventList";
import { Hero } from "./Hero";

export const Landing = () => {
  return (
    <>
      <div className="container">
        <Hero></Hero>
        <h2 className="mb-2 font-display text-2xl tracking-wider text-foreground sm:text-5xl font-black text-center">
          How it works
        </h2>
        <p className="text-gray-400 text-center mb-5 text-xl">
          How to discover upcoming concerts
        </p>
        <EventList isExplainer={true}></EventList>
      </div>
    </>
  );
};
