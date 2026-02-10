function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions(transactions) {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function getSummary(transactions) {
  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    tx.type === "Income" ? (income += tx.amount) : (expense += tx.amount);

    const balance = income - expense;
    const savings = balance > 0 ? balance : 0;

    return { income, expense, balance, savings };
  });
}
