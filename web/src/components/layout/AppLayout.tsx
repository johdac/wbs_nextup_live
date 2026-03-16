import { Outlet, useNavigation } from "react-router";
import { Header } from "./Header";
import Footer from "./Footer";
import { Player } from "../../features/player/Player";
import { PlayerProvider } from "../../features/player/PlayerContext";
import { AppToaster } from "../ui/AppToaster";

export const AppLayout = () => {
  const navigation = useNavigation();

  return (
    <div>
      <PlayerProvider>
        <AppToaster></AppToaster>
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
