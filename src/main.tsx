import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		{/* Match router base to Vite base so nested routes work under /fuelwise/. */}
		<BrowserRouter basename={import.meta.env.BASE_URL}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>,
);
