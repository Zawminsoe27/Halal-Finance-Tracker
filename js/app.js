const monthFilter = document.getElementById("monthFilter");
const transactionList = document.querySelector("ul");

monthFilter.addEventListener("change", renderTransactions);

function renderTransactions() {
  const selectMonths = monthFilter.value;
  const transactions = getTransactions();
  transactionList.innerHTML = "";

  const filteredTransactions = transactions.filter((tx) => {
    if (!selectMonths) return true;
    return tx.date.slice(0, 7) === selectMonths;
  });

  if (filteredTransactions.length === 0) {
    transactionList.innerHTML = `
      <li class="text-center text-gray-400 py-4">
        No transactions found
      </li>
    `;
  }
  filteredTransactions.forEach((tx) => {
    const li = document.createElement("li");
    li.className = "flex justify-between border-b pb-2";

    const sign = tx.type === "Income" ? "+" : "-";
    const color = tx.type === "Income" ? "text-green-600" : "text-red-600";

    li.innerHTML = `
    <div>
    <p class="font-medium">${tx.description}</p>
    <p class="text-xs text-gray-400">${tx.date}</p>
    </div>
    <div class= "flex gap-3 items-center">
	<span class="${color}">${sign}${tx.amount.toLocaleString()} MMK </span>
  <button class="text-sm text-gray-400 hover:text-red-500 delete-btn" data-id = "${tx.id}">
  X
  </button>
  </div>
	`;

    transactionList.appendChild(li);
  });
  updateDashboard(filteredTransactions);
}

transactionList.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    deleteTransaction(Number(e.target.dataset.id));
  }
});

function updateDashboard(filteredTransactions) {
  const zakatEl = document.getElementById("zakat");
  const transactions = filteredTransactions || getTransactions();
  const zakatInfo = calculateZakat(transactions);

  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    if (tx.type === "Income") {
      income += tx.amount;
    } else {
      expense += tx.amount;
    }
  });

  document.getElementById("income").textContent =
    income.toLocaleString() + " MMK";
  document.getElementById("expense").textContent =
    expense.toLocaleString() + " MMK";

  document.getElementById("balance").textContent =
    (income - expense).toLocaleString() + "MMK";
  if (zakatInfo.eligible) {
    0.0;
    zakatEl.textContent = zakatInfo.zakat.toLocaleString() + " MMK";
  } else {
    zakatEl.textContent = "Below Nisab";
  }
}
renderTransactions();
