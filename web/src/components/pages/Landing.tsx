import EventList from "../layout/Events";
import { Hero } from "./Hero";

export const Landing = () => {
  return (
    <>
      <div className="container">
        <Hero></Hero>
        <h2 className="mb-2 font-display text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
          All <span className="neon-gradient-text">Upcoming</span> Events
        </h2>
        <p className="mb-6 font-body text-sm text-white">
          Your next unforgettable night awaits
        </p>
        <EventList></EventList>
      </div>
    </>
  );
};
