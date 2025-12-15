import { Link, Route, Routes } from "react-router-dom";
import BuyersListPage from "./pages/BuyersListPage";
import BuyerDetailPage from "./pages/BuyerDetailPage";
import NewBuyerPage from "./pages/NewBuyerPage";

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Orange Sales</h1>
        <nav style={{ display: "flex", gap: 10 }}>
          <Link to="/">Buyers</Link>
          <Link to="/buyers/new">New buyer</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<BuyersListPage />} />
        <Route path="/buyers/new" element={<NewBuyerPage />} />
        <Route path="/buyers/:buyerId" element={<BuyerDetailPage />} />
      </Routes>
    </div>
  );
}
