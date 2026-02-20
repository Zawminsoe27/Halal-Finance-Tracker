let expensePieChart = null;

const monthFilter = document.getElementById("monthFilter");
const transactionList = document.querySelector("ul");
const submitBtn = document.querySelector("form button");
const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportBtn");
const exportExcelBtn = document.getElementById("exportExcelBtn");
const categorySelect = document.getElementById("categorySelect");

let editingId = null;
let financeChart = null;

monthFilter.addEventListener("change", renderApp);
searchInput.addEventListener("input", renderApp);
exportBtn.addEventListener("click", exportToCSV);
exportExcelBtn.addEventListener("click", exportToExcel);

function exportToExcel() {
  const transactions = getTransactions();
  const filtered = getFilteredTransactions(
    transactions,
    monthFilter.value,
    searchInput.value,
  );

  if (filtered.length === 0) {
    alert("No transactions to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(filtered);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  XLSX.writeFile(workbook, "transaction.xlsx");
}

function renderExpensePieChart(transactions) {
  const expenses = transactions.filter(
    (tx) => tx.type === "Expense" || tx.type === "expense",
  );

  const categoryTotals = {};

  expenses.forEach((tx) => {
    categoryTotals[tx.category] =
      (categoryTotals[tx.category] || 0) + Number(tx.amount);
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  const ctx = document.getElementById("expensePieChart").getContext("2d");

  if (expensePieChart) {
    expensePieChart.destroy();
  }
  if (labels.length === 0) return;
  expensePieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#ef4444",
            "#f97316",
            "#eab308",
            "#22c55e",
            "#3b82f6",
            "#a855f7",
          ],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

function exportToCSV() {
  const transactions = getTransactions();

  const filtered = getFilteredTransactions(
    transactions,
    monthFilter.value,
    searchInput.value,
  );

  if (filtered.length === 0) {
    alert("No transactions to export");
    return;
  }

  let csvContent = "Description,Amount, Type, Date\n";

  filtered.forEach((tx) => {
    csvContent += `${tx.description}, ${tx.amount}, ${tx.type}, ${tx.date}\n`;
  });
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// Render App
function renderApp() {
  const transactions = getTransactions();
  const filtered = getFilteredTransactions(
    transactions,
    monthFilter.value,
    searchInput.value,
  );
  renderTransactions(filtered);
  renderDashboard(filtered);
}

function renderChart(income, expense) {
  const ctx = document.getElementById("financeChart").getContext("2d");

  // Destroy old chart before creating new one

  if (financeChart) {
    financeChart.destroy();
  }

  financeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "MMK",
          data: [income, expense],
          backgroundColor: ["#16a34f", "#dc2626"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function getFilteredTransactions(transactions, month, searchTerm) {
  return transactions.filter((tx) => {
    const matchMonth = !month || tx.date.slice(0, 7) === month;

    const matchSearch =
      !searchTerm ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchMonth && matchSearch;
  });
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
    <p class="text-xs text-gray-400">${tx.date} . ${tx.category || "General"}</p>
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
    deleteTransaction(id);
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
  renderChart(income, expense);
  renderExpensePieChart(transactions);
}

const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.getElementById("body");

if (localStorage.getItem("darkMode") === "enabled") {
  enableDarkMode();
}
darkModeToggle.addEventListener("click", () => {
  if (localStorage.getItem("darkMode") !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

function enableDarkMode() {
  body.classList.remove("bg-purple-50");
  body.classList.add("bg-gray-900", "text-white");

  document.querySelectorAll(".bg-white").forEach((el) => {
    el.classList.remove("bg-white");
    el.classList.add("bg-gray-800");
  });

  localStorage.setItem("darkMode", "enabled");
  darkModeToggle.classList.add("text-white");
  darkModeToggle.textContent = "Light Mode";
}

function disableDarkMode() {
  body.classList.remove("bg-gray-900", "text-white");
  body.classList.add("bg-purple-50");
  document.querySelectorAll(".bg-gray-800").forEach((el) => {
    el.classList.remove("bg-gray-800");
    el.classList.add("bg-white");
  });

  localStorage.setItem("darkMode", "disabled");
  darkModeToggle.classList.remove("text-white");

  darkModeToggle.textContent = "Dark Mode";
}
renderApp();
