const monthFilter = document.getElementById("monthFilter");
const transactionList = document.querySelector("ul");
const submitBtn = document.querySelector("form button");

let editingId = null;

monthFilter.addEventListener("change", renderApp);

// Render App
function renderApp() {
  const transactions = getTransactions();
  const filtered = getFilteredTransactions(transactions, monthFilter.value);
  renderTransactions(filtered);
  renderDashboard(filtered);
}

function getFilteredTransactions(transactions, month) {
  if (!month) return transactions;

  return transactions.filter((tx) => tx.date.slice(0, 7) === month);
}

// Render Transaction
function renderTransactions(transactions) {
  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    transactionList.innerHTML = `
      <li class="text-center text-gray-400 py-4">
        No transactions found
      </li>
    `;
    return;
  }
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
	<span class="${color}">${sign}${tx.amount.toLocaleString()} MMK </span>
  <button class="text-sm text-white hover:bg-red-500 delete-btn bg-red-600 px-3 py-1 rounded-md" data-id = "${tx.id}">
  X
  </button>
  <button class="text-sm text-white hover:bg-blue-500 edit-btn bg-blue-600 px-3 py-1 rounded-md" data-id = "${tx.id}">
  Edit
  </button>
  </div>
	`;

    transactionList.appendChild(li);
  });
}

transactionList.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (e.target.classList.contains("delete-btn")) {
    deleteTransaction(Number(e.target.dataset.id));
    renderApp();
  }
  if (e.target.classList.contains("edit-btn")) {
    startEditingTransaction(id);
  }
});

function startEditingTransaction(id) {
  const tx = getTransactions().find((t) => t.id === id);
  if (!tx) return;

  editingId = id;

  descriptionInput.value = tx.description;
  amountInput.value = tx.amount;
  typeSelect.value = tx.type;
  dateInput.value = tx.date;

  submitBtn.textContent = "UpdateTransaction";
}

function clearEditing() {
  editingId = null;
  submitBtn.textContent = "Add Transaction";
}
function renderDashboard(transactions) {
  const { income, expense, balance, savings } = getSummary(transactions);
  const zakatInfo = calculateZakat(transactions);

  document.getElementById("savings").textContent =
    savings.toLocaleString() + " MMK";
  document.getElementById("income").textContent =
    income.toLocaleString() + " MMK";
  document.getElementById("expense").textContent =
    expense.toLocaleString() + " MMK";
  document.getElementById("balance").textContent =
    balance.toLocaleString() + " MMK";

  const zakatEl = document.getElementById("zakat");

  zakatEl.textContent = zakatInfo.eligible
    ? zakatInfo.zakat.toLocaleString() + " MMK"
    : "Below Nisab";
}

renderApp();
