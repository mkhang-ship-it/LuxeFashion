import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CartPage } from "./pages/CartPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "contact", Component: ContactPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "profile", Component: ProfilePage },
      { path: "cart", Component: CartPage },
      { path: "order-success", Component: OrderSuccessPage },
    ],
  },
]);
