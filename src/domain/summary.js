const PRICE_BAG_10 = 16;
const PRICE_BAG_20 = 30;

const KG_BAG_10 = 10;
const KG_BAG_20 = 20;

export function computeSummary(buyers) {
  let totalKilos = 0;
  let totalPaid = 0;
  let totalToBePaid = 0;

  for (const buyer of buyers) {
    const bags10 = Number(buyer.bagsOfTen) || 0;
    const bags20 = Number(buyer.bagsOfTwenty) || 0;

    const kilos =
      bags10 * KG_BAG_10 +
      bags20 * KG_BAG_20;

    const amount =
      bags10 * PRICE_BAG_10 +
      bags20 * PRICE_BAG_20;

    totalKilos += kilos;

    if (buyer.orangesPaid) {
      totalPaid += amount;
    } else {
      totalToBePaid += amount;
    }
  }

  return {
    totalKilos,
    totalPaid,
    totalToBePaid,
  };
}
