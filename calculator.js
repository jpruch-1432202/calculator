document.getElementById('investmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const year2LumpSum = parseFloat(document.getElementById('year2LumpSum').value) || 0;
    const year3LumpSum = parseFloat(document.getElementById('year3LumpSum').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    const annualReturn = parseFloat(document.getElementById('annualReturn').value);
    const years = parseInt(document.getElementById('years').value);
    const contributionIncrease = parseFloat(document.getElementById('contributionIncrease').value);

    // Arrays to store yearly data for the chart
    const labels = [];
    const totalValues = [];
    const contributionValues = [];
    const earningsValues = [];

    // Calculate investment
    const monthlyRate = (annualReturn / 100) / 12;
    let totalAmount = initialAmount;
    let currentMonthlyContribution = monthlyContribution;
    let totalContributions = initialAmount;

    // Add initial values
    labels.push('Start');
    totalValues.push(totalAmount);
    contributionValues.push(totalContributions);
    earningsValues.push(0);

    // Calculate for each year
    for (let year = 0; year < years; year++) {
        // Add lump sums at the start of years 2 and 3
        if (year === 1) { // Start of year 2
            totalAmount += year2LumpSum;
            totalContributions += year2LumpSum;
        }
        if (year === 2) { // Start of year 3
            totalAmount += year3LumpSum;
            totalContributions += year3LumpSum;
        }

        for (let month = 0; month < 12; month++) {
            totalAmount += currentMonthlyContribution;
            totalContributions += currentMonthlyContribution;
            totalAmount *= (1 + monthlyRate);
        }
        // Increase the monthly contribution at the end of each year
        currentMonthlyContribution *= (1 + contributionIncrease / 100);
        
        // Add data points for the chart
        labels.push(`Year ${year + 1}`);
        totalValues.push(totalAmount);
        contributionValues.push(totalContributions);
        earningsValues.push(totalAmount - totalContributions);
    }

    const totalEarnings = totalAmount - totalContributions;

    // Update numeric results
    document.getElementById('totalValue').textContent = 
        `$${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalContributions').textContent = 
        `$${totalContributions.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('totalEarnings').textContent = 
        `$${totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Show results and update chart
    document.getElementById('result').style.display = 'block';
    updateChart(labels, totalValues, contributionValues, earningsValues);
});

function updateChart(labels, totalValues, contributionValues, earningsValues) {
    // Destroy existing chart if it exists
    if (window.investmentChart instanceof Chart) {
        window.investmentChart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById('investmentChart').getContext('2d');
    window.investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Value',
                    data: totalValues,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: 'Total Contributions',
                    data: contributionValues,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: 'Total Earnings',
                    data: earningsValues,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(context.parsed.y);
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(value);
                        }
                    }
                }
            }
        }
    });
} 