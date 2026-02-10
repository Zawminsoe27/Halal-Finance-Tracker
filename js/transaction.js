const form = document.querySelector("form");
const descriptionInput = form.children[0];
const amountInput = form.children[1];
const typeSelect = form.children[2];
const dateInput = form.children[3];

form.addEventListener("submit", handleSubmit);

function validateTransaction(tx) {
  if (!tx.description) return "Description is required";
  if (isNaN(tx.amount) || tx.amount <= 0) return "Amount must be positive";
  if (!["Income", "Expense"].includes(tx.type)) return "Invalid Type";
  return null;
}
function handleSubmit(e) {
  e.preventDefault();

  // const description = descriptionInput.value.trim();
  // const amount = Number(amountInput.value);
  // const type = typeSelect.value;
  // const date =dateInput.value || new Date().toISOString().slice(0, 10);
  let transaction = {
    id: editingId || Date.now(),
    description: descriptionInput.value.trim(),
    amount: Number(amountInput.value),
    type: typeSelect.value,
    date: dateInput.value || new Date().toISOString().slice(0, 10),
  };
  const error = validateTransaction(transaction);

  if (error) {
    alert(error);
    return;
  }

  let transactions = getTransactions(); 
  if (editingId) {
    transactions = transactions.map((tx) =>
      tx.id === editingId ? transaction : tx,
    );
    clearEditing();
  } else {
    transactions.push(transaction);
  }
  saveTransactions(transactions);
  form.reset();
  renderApp();

}

function deleteTransaction(id) {
  let transactions = getTransactions();
  transactions = transactions.filter((tx) => tx.id !== id);
  saveTransactions(transactions);
  renderApp();
}
