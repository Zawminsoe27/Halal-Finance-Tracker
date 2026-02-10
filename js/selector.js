function getSummary(transactions) {
  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    if (tx.type === "Income") income += tx.amount;
    else expense += tx.amount;
  });

  const balance = income - expense;
  const savings = balance > 0 ? balance : 0;

  return {
    income,
    expense,
    balance,
    savings,
  };
}
