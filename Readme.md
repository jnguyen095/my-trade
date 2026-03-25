# MyTrade - AI-Powered Cryptocurrency Scalping Bot

An automated trading bot for Bitcoin (BTCUSDT) that combines technical analysis with AI-driven decision making. Uses local LLM (Ollama/Llama3) for intelligent trade signal refinement.

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [How to Run](#how-to-run)
7. [Trading Strategy](#trading-strategy)
8. [Risk Management](#risk-management)

---

## Features

✅ **AI-Enhanced Trading** — Llama3 LLM validates technical signals with confidence scoring  
✅ **Technical Analysis** — RSI, EMA20, EMA50 indicators on 1-minute candles  
✅ **Automated Execution** — Paper trading with realistic fee simulation (0.1%)  
✅ **Risk Management** — Stop loss (2%), take profit (5%), DCA strategy  
✅ **Dollar Cost Averaging** — Auto-buy on 1% price drops (max 5 times)  
✅ **Persistent Account** — Trade history and balance stored in JSON  
✅ **Scheduled Execution** — Runs autonomously every 1 minute  
✅ **Confidence Filtering** — Only executes trades when AI confidence ≥70%

---

## Architecture

```
Market Data (Binance API)
    ↓
Technical Indicators (RSI, EMA)
    ↓
Rule-Based Signal (BUY/SELL/HOLD)
    ↓
AI Decision (Ollama/Llama3)
    ↓
Confidence Check (≥70%?)
    ↓
Paper Trade Execution
    ├─ SL/TP Management
    ├─ DCA Logic
    └─ Account Update
    ↓
Persistent Storage (JSON)
```

### Core Components

| Component | File | Purpose |
|-----------|------|---------|
| **Orchestrator** | `src/agent.js` | Pipeline coordinator |
| **Market Data** | `src/skills/getMarketData.js` | Binance API integration |
| **Indicators** | `src/skills/calculateIndicators.js` | RSI, EMA calculations |
| **Signal** | `src/skills/generateSignal.js` | Rule-based BUY/SELL logic |
| **AI Decision** | `src/skills/aiDecision.js` | Llama3 confidence scoring |
| **Trade Engine** | `src/paper/tradeEngine.js` | Position & DCA management |
| **Account** | `src/paper/account.js` | Account state management |
| **Config** | `src/config.js` | Centralized settings |

---

## Prerequisites

### System Requirements
- **Node.js** — v16+ (for async/await support)
- **npm** — v7+ (package manager)
- **Ollama** — Local LLM server (download from https://ollama.ai)
- **Internet** — For Binance API calls

### Required Services

1. **Ollama Server** (Local LLM)
   - Download and install from https://ollama.ai
   - Must have Llama3 model available

2. **Node.js & npm**
   ```bash
   # Check versions
   node --version  # Should be v16+
   npm --version   # Should be v7+
   ```

---

## Installation

1. **Clone or download the project**
   ```bash
   cd d:\SourceCode\MyTrade
   # or your project directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables** (optional)
   ```bash
   # Create .env file in project root (optional)
   # SYMBOL=BTCUSDT
   # INTERVAL=1m
   # CONFIDENCE_THRESHOLD=70
   # STOP_LOSS_PERCENT=2
   # TAKE_PROFIT_PERCENT=5
   # DCA_TRIGGER_PERCENT=1
   # MAX_DCA_COUNT=5
   ```
   
   All have sensible defaults, so `.env` is optional.

---

## Configuration

Edit `src/config.js` or set environment variables:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `SYMBOL` | BTCUSDT | Trading pair (BTC/USDT) |
| `INTERVAL` | 1m | Candle timeframe (1 minute) |
| `CONFIDENCE_THRESHOLD` | 70 | Min AI confidence % to trade |
| `STOP_LOSS_PERCENT` | 2 | Stop loss: 2% below entry |
| `TAKE_PROFIT_PERCENT` | 5 | Take profit: 5% above entry |
| `DCA_TRIGGER_PERCENT` | 1 | Buy more when price drops 1% |
| `MAX_DCA_COUNT` | 5 | Maximum DCA additions per trade |

Example in `.env`:
```
SYMBOL=BTCUSDT
STOP_LOSS_PERCENT=2
TAKE_PROFIT_PERCENT=5
CONFIDENCE_THRESHOLD=70
```

---

## How to Run

### Step 1: Start Ollama Server (Required)

Open a new terminal and start the local LLM server:

```bash
ollama run llama3
```

This will:
- Download Llama3 model (first run only, ~4GB)
- Start the inference server on `http://localhost:11434`
- Keep running in the background

**Leave this terminal open** while trading.

### Step 2: Start the Trading Bot

In a separate terminal, start the bot:

```bash
# Navigate to project directory
cd d:\SourceCode\MyTrade

# Install dependencies (first time only)
npm install

# Start the bot
npm start
```

Or run directly:
```bash
node src/agent.js
```

**Expected Output:**
```
Trading bot started. Running every 1 minute...
=== ITERATION ===
Fetching market data...
Indicators: RSI=45.2, EMA20=42000, EMA50=41800
Signal: BUY (price < EMA50, RSI < 30)
AI Decision: BUY, confidence: 85%
=== PAPER TRADE ===
Opened LONG: {entryPrice: 42000, qty: 0.024, stopLoss: 41160, takeProfit: 44100}
Balance: $900
```

The bot will continue running and execute trades every 1 minute.

### Step 3: Monitor Trading Activity

View real-time trading logs:

```bash
# View trade.log file
type trade.log

# Or tail it (Windows PowerShell)
Get-Content trade.log -Tail 20 -Wait
```

View account status:

```bash
# Check current balance and positions
type paper_account.json
```

### Step 4: Stop the Bot

Press `Ctrl+C` in the terminal running the bot.

The Ollama server can stay running for the next session.

---

## Trading Strategy

### Signal Generation
```
BUY Signal:  RSI < 30 AND EMA20 > EMA50 (oversold + bullish)
SELL Signal: RSI > 70 AND EMA20 < EMA50 (overbought + bearish)
HOLD: Otherwise
```

### AI Refinement
- Technical signal sent to Llama3 with current indicators
- AI returns decision + confidence (0-100%)
- Trade only executes if confidence ≥70%

### Position Management
- **Entry**: 10% of account balance per trade
- **Exit**: Manual SELL signal OR SL/TP triggered
- **Fee**: 0.1% on all trades (realistic simulation)

---

## Risk Management

### Stop Loss & Take Profit (Automatic)
- **Stop Loss**: 2% below average entry price
- **Take Profit**: 5% above average entry price
- Both checked every minute, auto-executed

### Dollar Cost Averaging (DCA)
If price drops 1% from the **original entry price** (not average):
- Automatically buys more at lower price
- Amount: Initial position size ÷ (DCA count + 1)
- Maximum: 5 additional buys per position
- Triggers **regardless of BUY/SELL indicators**
- Requires positive account balance

### Capital Safety
- DCA only executes if account has sufficient balance
- Maximum 5 DCA additions prevents overexposure
- Paper trading (no real money at risk)

### Confidence Filtering
- Only executes trades when AI confidence ≥70%
- Reduces false signals from technical analysis alone
- Decreases trade frequency, increases quality

---

## Example Trading Scenario

```
TIME 10:00 - Bot Start
- Balance: $1000
- Signal: BUY (RSI=28, EMA20>EMA50)
- AI Confidence: 82%
- Entry: $42,000 → Opens LONG with 0.024 BTC
- SL: $41,160 | TP: $44,100
- New Balance: $900

TIME 10:05 - Price drops to $41,580 (1% down)
- DCA Triggered!
- DCA Add: 0.012 BTC at $41,580
- New Avg Entry: $41,860
- New Balance: $800

TIME 10:15 - Price drops again to $41,423 (1% below new avg)
- DCA Triggered again!
- DCA Add: 0.008 BTC at $41,423
- New Avg Entry: $41,764
- DCA Count: 2/5

TIME 10:45 - Price rallies to $43,850 (TP hit!)
- Position closed at take profit
- PnL: +$472 (before fees)
- New Balance: $1,272
```

---

## Troubleshooting

### "Cannot connect to Ollama at localhost:11434"
**Solution**: Make sure Ollama server is running in another terminal:
```bash
ollama run llama3
```

### "Failed to fetch market data"
**Solution**: Check internet connection and Binance API availability
```bash
# Test Binance API
curl https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=5
```

### "Insufficient balance to execute DCA"
**Solution**: This is expected. Bot will try again next minute. Position either closes or needs recovery.

### npm install fails
**Solution**: Clear npm cache and try again:
```bash
npm cache clean --force
npm install
```

---

## Files Reference

```
MyTrade/
├── src/
│   ├── agent.js                 # Main orchestrator (entry point)
│   ├── config.js                # Configuration management
│   ├── ai/
│   │   └── ollama.js            # Ollama LLM integration
│   ├── skills/
│   │   ├── getMarketData.js     # Binance API
│   │   ├── calculateIndicators  # RSI, EMA
│   │   ├── generateSignal.js    # Rule-based signals
│   │   ├── aiDecision.js        # AI confidence
│   │   └── executeTrade.js      # Trade execution
│   ├── paper/
│   │   ├── account.js           # Account abstraction
│   │   ├── storage.js           # JSON persistence
│   │   └── tradeEngine.js       # Trading logic (DCA, SL, TP)
│   ├── utils/
│   │   └── logger.js            # Trade logging
│   └── dashboard/               # (WIP) Web dashboard
├── paper_account.json           # Account state (auto-created)
├── trade.log                    # Trading history (auto-created)
├── package.json                 # Dependencies
├── .env                         # Environment variables (optional)
└── Readme.md                    # This file
```

---

## Next Steps

1. ✅ Run the bot with `npm start`
2. ✅ Monitor trades in `trade.log`
3. ✅ Check balance in `paper_account.json`
4. ✅ Adjust config parameters based on market conditions
5. 🔄 Analyze trade history for strategy improvements
6. 📊 (Future) Connect to real broker API for live trading

---

## Support & Contribution

For issues, questions, or improvements, check the code comments and architecture documentation in this README.

---

**Last Updated**: March 24, 2026  
**Status**: Paper Trading (Simulation Only)
