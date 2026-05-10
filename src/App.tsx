import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ExchangeTokenPage from "./pages/ExchangeTokenPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { Routes, Route } from "react-router-dom";

// function DashboardPage() {
//   return <div>Dashboard Page</div>;
// }

export default function App() {
	return (
		<>
			<main>
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<HomePage />} />
					<Route path="/exchange_token" element={<ExchangeTokenPage />} />

					{/* Protected routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<DashboardPage />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</main>
		</>
	);
}
