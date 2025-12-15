import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBuyers } from "../state/useBuyers";
import { buttonClass } from "../ui/ui";

export default function NewBuyerPage() {
  const { addBuyer } = useBuyers();
  const navigate = useNavigate();

  const [buyerName, setBuyerName] = useState("");
  const [bagsOfTen, setBagsOfTen] = useState(0);
  const [bagsOfTwenty, setBagsOfTwenty] = useState(0);

  async function onSubmit(event) {
    event.preventDefault();
    const newBuyerId = await addBuyer({
      buyerName,
      bagsOfTen: Number(bagsOfTen),
      bagsOfTwenty: Number(bagsOfTwenty),
    });
    navigate(`/buyers/${newBuyerId}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "grid", gap: 12, maxWidth: 420 }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <label>Nombre del comprador</label>
        <input
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          style={{ padding: 8 }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Bolsas de 10 (€16)</label>
        <input
          type="number"
          min="0"
          value={bagsOfTen}
          onChange={(e) => setBagsOfTen(e.target.value)}
          style={{ padding: 8 }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Bolsas de 20 (€30)</label>
        <input
          type="number"
          min="0"
          value={bagsOfTwenty}
          onChange={(e) => setBagsOfTwenty(e.target.value)}
          style={{ padding: 8 }}
        />
      </div>

      <button type="submit" className={buttonClass}>
        Crear comprador
      </button>
    </form>
  );
}
