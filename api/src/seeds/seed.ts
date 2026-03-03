import axios from "axios";

// use like so: from within the /api folder "node --env-file=.env.development.local src/seeds/seed.ts"

async function seed() {
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

  //---- SEED ARTISTS

  // console.log("Seeding artists");

  // await axios.post(
  //   `${apiUrl}/artists`,
  //   {},
  //   {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   },
  // );

  // console.log("Seeding artists complete");

  //---- SEED LOCATIONS

  console.log("Seeding locations to", apiUrl);

  const locations = [
    {
      name: "Madame Claude",
      geo: {
        type: "Point",
        coordinates: [13.4205455, 52.5130996],
      },
      zip: "10997",
      address: "Lübbener Str. 19",
      city: "Berlin",
      country: "Germany",
      description:
        "Formerly a brothel very close to the berlin wall, MADAME CLAUDE is a bar located in the Kreuzberg-Schlesisches Tor district, which is well-known for its intense alternative nightlife. <br>Initiated by the childish dream to play in a backwards flat, the decoration of the main room of Madame Claude is a reconstitution of an apartment which would have been built upside down challenging the laws of gravity with furnitures on the ceiling.<br>Madame Claude welcomes events, concerts and DJ’s from 7pm till late.<h2>About us</h2>We are 3 French friends who were previously working in Paris, Madrid and London. <br>Some years ago, we decided to leave our professional activities to gather in Berlin in order to open a club/music venue although none of us was able to speak German.",
      websiteUrl: "https://madameclaude.de/",
    },
    {
      name: "Rotbart",
      geo: {
        type: "Point",
        coordinates: [13.4466089, 52.4742216],
      },
      zip: "12055",
      address: "Böhmische Str. 43",
      city: "Berlin",
      country: "Germany",
      websiteUrl: "https://www.rotbart-rixdorf.de/",
    },
  ];

  const res = await Promise.all(
    locations.map((location) =>
      axios.post(`${apiUrl}/locations`, location, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ),
  );

  console.log("Seeding locations complete");
}

seed();
