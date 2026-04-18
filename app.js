import { portfolioData } from './data.js';

const US_CAD_RATE = portfolioData.currency.usdToCad;

function formatCurrency(val, currency = "CAD") {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(val);
}

function calculatePortfolio() {
  let totalValueCAD = 0;
  let totalCostCAD = 0;
  
  const processedPositions = portfolioData.positions.map(pos => {
    const valueBase = pos.shares * pos.currentPrice;
    const costBase = pos.shares * pos.avgCost;
    
    const valueCAD = pos.currency === "USD" ? valueBase * US_CAD_RATE : valueBase;
    const costCAD = pos.currency === "USD" ? costBase * US_CAD_RATE : costBase;
    
    totalValueCAD += valueCAD;
    totalCostCAD += costCAD;
    
    return {
      ...pos,
      valueCAD,
      costCAD,
      gainLossCAD: valueCAD - costCAD,
      gainLossPct: ((valueCAD - costCAD) / costCAD) * 100
    };
  });

  return { processedPositions, totalValueCAD, totalCostCAD };
}

function renderDashboard() {
  const { processedPositions, totalValueCAD, totalCostCAD } = calculatePortfolio();
  
  // Update Header Summary
  document.getElementById('total-value-cad').textContent = formatCurrency(totalValueCAD);
  const totalGainPct = ((totalValueCAD - totalCostCAD) / totalCostCAD) * 100;
  document.getElementById('total-gain-pct').textContent = `${totalGainPct > 0 ? '+' : ''}${totalGainPct.toFixed(1)}%`;
  
  // PLOC Check
  const nonRegPos = processedPositions.filter(p => p.account === "Non-Reg");
  const investedPLOC = nonRegPos.reduce((sum, p) => sum + p.valueCAD, 0);
  const plocCash = portfolioData.leverage.plocLimit - investedPLOC;
  document.getElementById('ploc-cash').textContent = formatCurrency(plocCash);
  
  // Render Table
  const tbody = document.getElementById('holdings-table-body');
  tbody.innerHTML = '';
  
  let riskFlags = 0;
  const alertsContainer = document.getElementById('alerts-container');
  alertsContainer.innerHTML = '';

  processedPositions.sort((a, b) => b.valueCAD - a.valueCAD).forEach(pos => {
    const allocation = (pos.valueCAD / totalValueCAD) * 100;
    const isOverAllocated = allocation > 10;
    
    if (isOverAllocated) {
      riskFlags++;
      addAlert("Over-Allocation", `${pos.symbol} is ${allocation.toFixed(1)}% of portfolio (Max 10%).`, "ruby");
    }

    // Example Upside Alert (Simulated for this demo based on search)
    if (pos.symbol === "RY.TO" || pos.symbol === "TD.TO") {
        riskFlags++;
        addAlert("Low Upside", `${pos.symbol} is trading near or above analyst targets.`, "amber");
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${pos.symbol}</strong></td>
      <td>${pos.name}</td>
      <td><span class="badge" style="background: rgba(255,255,255,0.05)">${pos.account}</span></td>
      <td><span class="badge badge-tech">${pos.sector}</span></td>
      <td>${formatCurrency(pos.valueCAD)}</td>
      <td style="color: ${isOverAllocated ? 'var(--accent-ruby)' : 'inherit'}">
        ${allocation.toFixed(1)}%
      </td>
      <td class="${pos.gainLossCAD >= 0 ? 'delta-up' : 'delta-down'}">
        ${pos.gainLossPct > 0 ? '+' : ''}${pos.gainLossPct.toFixed(1)}%
      </td>
      <td>
        ${isOverAllocated ? '<span class="flag-warning"><i data-lucide="alert-circle" size="14"></i> Trim</span>' : '✅ Healthy'}
      </td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('risk-flags').textContent = `${riskFlags} Flags detected`;
  document.getElementById('risk-status').textContent = riskFlags > 3 ? "Elevated Risk" : "Healthy";
  document.getElementById('risk-status').style.color = riskFlags > 3 ? "var(--accent-ruby)" : "var(--accent-emerald)";

  // Re-init icons for new rows
  lucide.createIcons();
}

function addAlert(title, message, color) {
  const container = document.getElementById('alerts-container');
  const alert = document.createElement('div');
  alert.className = 'card';
  alert.style.borderColor = `var(--accent-${color})`;
  alert.innerHTML = `
    <div class="card-title" style="color: var(--accent-${color})">
      <i data-lucide="alert-triangle"></i> ${title}
    </div>
    <p style="font-size: 0.875rem; line-height: 1.5">${message}</p>
  `;
  container.appendChild(alert);
}

// State management for API keys
const getKeys = () => ({
    anthropic: localStorage.getItem('anthropic_key') || '',
    market: localStorage.getItem('market_key') || ''
});

// UI Elements for Modals
const settingsModal = document.getElementById('settings-modal');
const aiReviewOverlay = document.getElementById('ai-review-overlay');

document.getElementById('settings-btn').addEventListener('click', () => {
    const keys = getKeys();
    document.getElementById('anthropic-key').value = keys.anthropic;
    document.getElementById('market-key').value = keys.market;
    settingsModal.style.display = 'flex';
});

document.getElementById('close-settings').addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

document.getElementById('save-settings').addEventListener('click', () => {
    localStorage.setItem('anthropic_key', document.getElementById('anthropic-key').value);
    localStorage.setItem('market_key', document.getElementById('market-key').value);
    settingsModal.style.display = 'none';
    alert("Settings saved!");
});

// AI Review Logic
document.getElementById('run-ai-btn').addEventListener('click', async () => {
    const keys = getKeys();
    if (!keys.anthropic) {
        alert("Please enter your Anthropic API Key in Settings first.");
        return;
    }

    aiReviewOverlay.style.display = 'flex';
    const content = document.getElementById('ai-response-content');
    content.innerHTML = '<div class="animate-fade-in">🧠 Claude is analyzing your portfolio...</div>';

    try {
        const { processedPositions, totalValueCAD } = calculatePortfolio();
        const portfolioText = processedPositions.map(p => 
            `${p.symbol}: ${p.shares} shares @ ${formatCurrency(p.currentPrice, p.currency)}`
        ).join('\n');

        const prompt = `Review this portfolio for a Growth Investor (Low risk tolerance, 15-20% target return).
Total Value: ${formatCurrency(totalValueCAD)}
Positions:
${portfolioText}
Provide a clear Buy/Sell/Hold verdict for each.`;

        // Direct API Call (Note: May require CORS proxy in some environments)
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': keys.anthropic,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'anthropic-dangerous-direct-browser-access': 'true' // Explicitly allowed for this use case
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        content.innerHTML = `<div class="animate-fade-in">${data.content[0].text.replace(/\n/g, '<br>')}</div>`;
    } catch (err) {
        content.innerHTML = `<div style="color: var(--accent-ruby)">Error: ${err.message}<br><br>Note: Browser-based API calls to Anthropic may be blocked by CORS unless you use a proxy or specific browser settings.</div>`;
    }
});

document.getElementById('close-ai-review').addEventListener('click', () => {
    aiReviewOverlay.style.display = 'none';
});

document.getElementById('copy-claude-btn').addEventListener('click', () => {
    const { processedPositions, totalValueCAD } = calculatePortfolio();
    const portfolioSummary = processedPositions.map(p => 
        `- ${p.symbol}: ${p.shares} shares @ ${formatCurrency(p.currentPrice, p.currency)} (${((p.valueCAD/totalValueCAD)*100).toFixed(1)}% allocation)`
    ).join('\n');

    const prompt = `Please review my current portfolio and provide a Growth Investor Verdict based on my framework.

Current Date: ${new Date().toISOString().split('T')[0]}
Total Value: ${formatCurrency(totalValueCAD)}

Current Positions:
${portfolioSummary}

Focus on:
1. Trimming any positions exceeding 10% allocation.
2. Identifying stocks with >10% upside.
3. Risk Score assessment for high-volatility holdings.`;

    navigator.clipboard.writeText(prompt).then(() => {
        alert("Claude Prompt copied to clipboard!");
    });
});

renderDashboard();
