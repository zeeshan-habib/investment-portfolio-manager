# Growth Portfolio Pro Dashboard 📈

A premium, glassmorphic investment portfolio manager and PWA (Progressive Web App) designed for growth-oriented investors. Streamline your portfolio reviews with direct Claude AI integration.

## ✨ Features

- **Premium UI**: Glassmorphic design with real-time risk flagging.
- **PWA Support**: Installable on Desktop (Mac/PC) and Mobile as a standalone app.
- **Direct Claude Review**: Call Claude Sonnet directly from the dashboard to analyze your holdings (requires Anthropic API key).
- **Risk Management**: Automatic alerts for 10% allocation limits and leveraged PLOC cash requirements.
- **Multi-Currency**: Seamlessly handles CAD and USD positions with conversion logic.

## 🚀 Getting Started

### 1. Local Preview
Serve the files using a simple HTTP server:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000` in your browser.

### 2. Installation
- Open the dashboard in Chrome or Edge.
- Click the **Install** icon in the address bar to add it to your applications.

### 3. AI Integration
- Click the **Settings (Gear icon)**.
- Add your **Anthropic API Key** to enable live AI reviews.

## 🛠️ Built With
- Vanilla HTML5 / CSS3 (CSS Variables, Flex/Grid, Glassmorphism)
- JavaScript (ES Modules, Service Workers)
- Lucide Icons

## 📝 License
MIT
