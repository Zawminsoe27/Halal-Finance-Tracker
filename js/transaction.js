const form = document.querySelector("form");
const descriptionInput = form.children[0];
const amuntInput = form.children[1];
const typeSelect = form.children[2];
const dateInput = form.children[3];
form.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amuntInput.value);
  const type = typeSelect.value;
  const date = dateInput.value || new Date().toISOString().slice(0, 10);

  if (!description || amount <= 0) return;

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type,
    date,
  };

  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);

  form.reset();
  renderTransactions();
}

function deleteTransaction(id) {
  let transactions = getTransactions();
  transactions = transactions.filter((tx) => tx.id !== id);
  saveTransactions(transactions);
  renderTransactions();
}
