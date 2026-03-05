// use like so: from within the /api folder "node --env-file=.env.development.local src/seeds/seed.ts"

import axios from "axios";
import { locationsSeed } from "./seed.locations.ts";
import { artistsSeed } from "./seed.artists.ts";
import { eventsSeed } from "./seed.events.ts";

async function seed() {
  // ---- VARS

  // const authServer = process.env.AUTH_URL;
  // const email = process.env.SEED_USER_LOGIN;
  // const password = process.env.SEED_USER_PASSWORD;
  const apiUrl = process.env.API_URL;
  const token = process.env.SEED_ACCESS_TOKEN;

  // const login = await axios.post(`${authServer}/auth/login`, {
  //   email,
  //   password,
  // });

  // const token = login.data.accessToken;

  if (!apiUrl || !token) {
    console.error("Missing env vars", "apiUrl", apiUrl, "token", token);
    process.exit(1);
  }

  // ---- HELPER FUNCTIONS

  async function post(apiUrl: string, path: string, data: any, token: string) {
    try {
      const res = await axios.post(`${apiUrl}${path}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err: any) {
      console.error(`❌ POST ${path} failed`);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);
      } else {
        console.error(err.message);
      }

      throw err;
    }
  }

  async function get(apiUrl: string, path: string, token: string) {
    try {
      const res = await axios.get(`${apiUrl}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err: any) {
      console.error(`❌ GET ${path} failed`);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);
      } else {
        console.error(err.message);
      }

      throw err;
    }
  }

  // ---- SEEDING

  try {
    // ---- SEED ARTISTS

    console.log("Seeding artists");

    const createdArtists = await Promise.all(
      artistsSeed.map((artist) => post(apiUrl, "/artists", artist, token)),
    );

    const artistIdByName = Object.fromEntries(
      createdArtists.map((artist) => [artist.name, artist.id]),
    );

    console.log("Seeding artists complete");

    //---- SEED LOCATIONS

    console.log("Seeding locations");

    const createdLocations = await Promise.all(
      locationsSeed.map((location) =>
        post(apiUrl, "/locations", location, token),
      ),
    );

    const locationIdByName = Object.fromEntries(
      createdLocations.map((location) => [location.name, location.id]),
    );

    console.log("Seeding locations complete");

    //---- SEED EVENTS

    console.log("Seeding events");

    function resolveEventSeed(event: any) {
      const locationId = locationIdByName[event.location];
      if (!locationId) throw new Error(`Unknown location: ${event.location}`);

      const artistsIds = event.artists.map((name: string) => {
        const id = artistIdByName[name];
        if (!id) throw new Error(`Unknown artist: ${name}`);
        return id;
      });

      return {
        title: event.title,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        description: event.description,
        locationId,
        artistsIds,
      };
    }

    const resolvedEvents = eventsSeed.map(resolveEventSeed);

    await Promise.all(
      resolvedEvents.map((event) => post(apiUrl, "/events", event, token)),
    );

    console.log("Seeding events complete");
  } catch (err: any) {
    console.error("❌ Seed failed");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response:", err.response.data);
    } else if (err instanceof Error) {
      console.error(err.stack ?? err.message);
    } else {
      console.error(err);
    }

    process.exit(1);
  }
}

seed();
