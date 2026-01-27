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

  transactions.forEach((tx) => {
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
	<span>${tx.description}</span>
	<span class="${color}">${sign}${tx.amount.toLocaleString()} MMK </span>
  <button class="text-sm text-gray-400 hover:text-red-500" onclick="deleteTransaction(${tx.id})">
  X
  </button>
  </div>
	`;

    transactionList.appendChild(li);
  });
  updateDashboard(filteredTransactions);
}

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
    zakatEl.textContent = zakatInfo.zakat.toLocaleString() + " MMK";
  } else {
    zakatEl.textContent = "Below Nisab";
  }
}
renderTransactions();
