document.getElementById('investmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    const annualReturn = parseFloat(document.getElementById('annualReturn').value);
    const years = parseInt(document.getElementById('years').value);
    const contributionIncrease = parseFloat(document.getElementById('contributionIncrease').value);

    // Calculate investment
    const monthlyRate = (annualReturn / 100) / 12;
    let totalAmount = initialAmount;
    let currentMonthlyContribution = monthlyContribution;
    let totalContributions = initialAmount;

    // Calculate for each month
    for (let year = 0; year < years; year++) {
        for (let month = 0; month < 12; month++) {
            totalAmount += currentMonthlyContribution;
            totalContributions += currentMonthlyContribution;
            totalAmount *= (1 + monthlyRate);
        }
        // Increase the monthly contribution at the end of each year
        currentMonthlyContribution *= (1 + contributionIncrease / 100);
    }

    const totalEarnings = totalAmount - totalContributions;

    // Display results
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    
    document.getElementById('totalValue').textContent = 
        `$${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalContributions').textContent = 
        `$${totalContributions.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalEarnings').textContent = 
        `$${totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}); 