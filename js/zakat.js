const NISAB = 4488000;

function calculateZakat(transactions) {
  let zakatableAmount = 0;

  transactions.forEach((tx) => {
    if (tx.type === "Income") {
      zakatableAmount += tx.amount;
    }
  });
  if (zakatableAmount < NISAB) {
    return {
      eligible: false,
      zakat: 0,
      zakatableAmount,
    };
  }

  return {
    eligible: true,
    zakat: zakatableAmount * 0.025,
    zakatableAmount,  
  };
}
