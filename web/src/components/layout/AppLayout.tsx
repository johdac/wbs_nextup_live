import { Outlet, useNavigation } from "react-router";
import { Header } from "./Header";
import Footer from "./Footer";
import { Player } from "../../features/player/Player";
import { PlayerProvider } from "../../features/player/PlayerContext";

export const AppLayout = () => {
  const navigation = useNavigation();

  return (
    <div>
      <PlayerProvider>
        <Player></Player>
        <Header></Header>
        {navigation.state === "loading" && <p>Loading...</p>}
        <main>
          <Outlet />
        </main>
      </PlayerProvider>
      <Footer></Footer>
    </div>
  );
};
