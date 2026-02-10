function calculateSavings(transactions) {
  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    if (tx.type == "Income") {
      income += tx.amount;
    } else {
      expense += tx.amount;
    }
  });
  return income - expense;
}
