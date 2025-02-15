import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/modals";

import { MantineProvider } from "@mantine/core";

import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
createRoot(document.getElementById("root")).render(
  <MantineProvider defaultColorScheme="dark">
    <Notifications />
    <ModalsProvider />
    <App />
  </MantineProvider>
);
