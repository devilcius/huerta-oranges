export function computeSummary(buyers) {
  let totalKilos = 0;
  let totalPaid = 0;
  let totalToBePaid = 0;

  let totalPaidBizum = 0;
  let totalPaidCash = 0;

  for (const buyer of buyers) {
    const bags10 = Number(buyer.bagsOfTen) || 0;
    const bags20 = Number(buyer.bagsOfTwenty) || 0;

    const kilos = bags10 * 10 + bags20 * 20;
    const euros = bags10 * 16 + bags20 * 30;

    totalKilos += kilos;

    if (buyer.orangesPaid) {
      totalPaid += euros;

      if (buyer.paidMethod === "bizum") {
        totalPaidBizum += euros;
      } else if (buyer.paidMethod === "cash") {
        totalPaidCash += euros;
      }
    } else {
      totalToBePaid += euros;
    }
  }

  return {
    totalKilos,
    totalPaid,
    totalToBePaid,
    totalPaidBizum,
    totalPaidCash,
  };
}
