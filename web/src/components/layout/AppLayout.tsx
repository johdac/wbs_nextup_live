import { Outlet, useNavigation } from "react-router";
import { Header } from "./Header";
import Footer from "./Footer";
import { Player } from "./Player";

export const AppLayout = () => {
  const navigation = useNavigation();

  return (
    <div>
      <Player></Player>
      <Header></Header>

      {navigation.state === "loading" && <p>Loading...</p>}

      <main>
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
};
