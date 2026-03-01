import { Outlet, useNavigation } from "react-router";
import { MainLayout } from "./MainLayout";
import { Header } from "./Header";
import Footer from "./Footer";

export const AppLayout = () => {
  const navigation = useNavigation();

  return (
    <MainLayout>
      <Header></Header>

      {navigation.state === "loading" && <p>Loading...</p>}

      <main>
        <Outlet />
      </main>

      <Footer></Footer>
    </MainLayout>
  );
};
