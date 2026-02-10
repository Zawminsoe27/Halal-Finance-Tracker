const NISAB = 4488000;

function calculateZakat(transactions) {
  let savings = 0;

  transactions. Each((tx) => {
    if (tx.type === "Income") {
      savings += tx.amount;
    } else {
      savings -= tx.amount;
    }
  });
  if (savings < NISAB) {
    return {
      eligible: false,
      zakat: 0,
      zakatableAmount: savings,
    };
  }

  return {
    eligible: true,
    zakat: savings * 0.025,
    zakatableAmount: savings,
  };
}
