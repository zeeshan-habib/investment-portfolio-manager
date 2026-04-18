export const portfolioData = {
  lastUpdated: "2026-04-18",
  currency: {
    cadToUsd: 0.74, // Example rate
    usdToCad: 1.35
  },
  accounts: [
    { id: "rrsp", name: "RRSP", goal: "Retirement", risk: "Low" },
    { id: "tfsa", name: "TFSA", goal: "Growth", risk: "Moderate-High" },
    { id: "fhsa", name: "FHSA", goal: "Home Purchase", risk: "Lowest" },
    { id: "nonreg", name: "Non-Registered", goal: "Leveraged Growth", risk: "Moderate" }
  ],
  positions: [
    // CAD Positions
    { symbol: "RY.TO", name: "Royal Bank of Canada", account: "RRSP", sector: "Financials", shares: 32.51, avgCost: 196.83, currentPrice: 244.23, currency: "CAD" },
    { symbol: "TRP.TO", name: "TC Energy Corp", account: "RRSP", sector: "Energy", shares: 17, avgCost: 85.32, currentPrice: 82.92, currency: "CAD" },
    { symbol: "ENB.TO", name: "Enbridge Inc", account: "FHSA", sector: "Energy", shares: 24.66, avgCost: 62.28, currentPrice: 72.09, currency: "CAD" },
    { symbol: "POW.TO", name: "Power Corp of Canada", account: "FHSA", sector: "Financials", shares: 20, avgCost: 55.36, currentPrice: 73.36, currency: "CAD" },
    { symbol: "TD.TO", name: "Toronto-Dominion Bank", account: "FHSA", sector: "Financials", shares: 30, avgCost: 126.13, currentPrice: 144.17, currency: "CAD" },
    { symbol: "XBAL.TO", name: "iShares Core Balanced ETF", account: "FHSA", sector: "ETF-Balanced", shares: 428, avgCost: 34.16, currentPrice: 34.74, currency: "CAD" },
    
    // USD Positions
    { symbol: "SCHD", name: "Schwab US Dividend ETF", account: "RRSP", sector: "ETF-Dividend", shares: 100, avgCost: 31.69, currentPrice: 31.05, currency: "USD" },
    { symbol: "VT", name: "Vanguard Total World ETF", account: "RRSP", sector: "ETF-Global", shares: 107, avgCost: 139.42, currentPrice: 150.84, currency: "USD" },
    { symbol: "GOOG", name: "Alphabet Inc", account: "TFSA", sector: "Communication", shares: 16, avgCost: 310.22, currentPrice: 339.40, currency: "USD" },
    { symbol: "MSFT", name: "Microsoft Corp", account: "TFSA", sector: "Technology", shares: 15, avgCost: 399.84, currentPrice: 422.79, currency: "USD" },
    { symbol: "AVGO", name: "Broadcom Inc", account: "TFSA", sector: "Semiconductors", shares: 20, avgCost: 379.65, currentPrice: 406.54, currency: "USD" },
    { symbol: "AMZN", name: "Amazon.com Inc", account: "TFSA", sector: "Consumer/Cloud", shares: 30, avgCost: 248.54, currentPrice: 250.56, currency: "USD" },
    { symbol: "AOM", name: "iShares Core 40/60 ETF", account: "FHSA", sector: "ETF-Balanced", shares: 50, avgCost: 48.90, currentPrice: 49.05, currency: "USD" },
    { symbol: "NVDA", name: "Nvidia Corporation", account: "Non-Reg", sector: "AI-Semiconductors", shares: 14, avgCost: 198.48, currentPrice: 201.68, currency: "USD" }
  ],
  leverage: {
    plocLimit: 8400,
    plocInterest: 0.0445,
    cashRequirement: 4400
  }
};
