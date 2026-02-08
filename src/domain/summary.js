export function computeSummary(buyers, expenses = []) {
  let totalKilos = 0;
  let totalPaid = 0;
  let totalToBePaid = 0;

  let totalPaidBizum = 0;
  let totalPaidCash = 0;

  let total10kgBags = 0;
  let total20kgBags = 0;
  let totalExpenses = 0;

  for (const buyer of buyers) {
    const bags10 = Number(buyer.bagsOfTen) || 0;
    const bags20 = Number(buyer.bagsOfTwenty) || 0;

    const kilos = bags10 * 10 + bags20 * 20;
    const euros = bags10 * 16 + bags20 * 30;

    totalKilos += kilos;
    total10kgBags += bags10;
    total20kgBags += bags20;

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

  for (const expense of expenses) {
    totalExpenses += (Number(expense.amountCents) || 0) / 100;
  }

  const balance = totalPaid - totalExpenses;

  return {
    totalKilos,
    totalPaid,
    totalToBePaid,
    totalPaidBizum,
    totalPaidCash,
    total10kgBags,
    total20kgBags,
    totalExpenses,
    balance,
  };
}
