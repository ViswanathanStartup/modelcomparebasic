# TechViswa Model Compare Basic 🤖

**Free AI Model Comparison Tool - Compare Up to 3 Models Side-by-Side**

Model Compare Basic is a free, no-login tool provided by TechViswa that helps developers quickly compare AI models. Browse models from 39+ providers, compare up to 3 at once, and understand pricing and capabilities at a glance.

[![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

---

## 🎯 Purpose

This is a **free precursor** to TechViswa's full SaaS product, designed to:
- Help developers discover and compare AI models
- Drive SEO traffic
- Convert users to TechViswa Test Bench for advanced testing
- Provide value with zero friction (no login required)

---

## ✨ What's Included

### Core Features (Basic Version)


### 🧪 Model Performance Testing Playground (NEW in v1.1!)

**Test LLM models live with your API keys directly in your browser!**

#### Live API Integration
- **OpenAI, Anthropic, and Google support**: Test GPT, Claude, and Gemini models in real-time
- **Maximum security**: API keys are NEVER stored anywhere - not in cookies, localStorage, or our servers
- **Session-only keys**: Enter keys each time you test for complete privacy
- **Direct API calls**: Your keys never touch our servers - requests go straight to providers

#### Side-by-Side Response Comparison
- **Test up to 4 models simultaneously** with the same prompt
- **Visual comparison cards** showing responses, metrics, and quality
- **Error handling**: Clear error messages when tests fail

#### Real Performance Metrics
- **Response time measurement**: Accurate millisecond-level timing
- **Actual token usage**: Real input/output token counts from APIs
- **True cost calculation**: Exact costs based on actual usage, not estimates
- **Quick stats**: Instantly see fastest, cheapest, and highest-rated models

### Core Features (Basic Version)

- ✅ **Compare up to 3 models** side-by-side
- ✅ **Browse 150+ AI models** from 39+ providers
- ✅ **Search & filter** by provider, family, modality
- ✅ **View pricing** (input/output cost per 1M tokens)
- ✅ **Context windows** comparison
- ✅ **Modalities** (text, vision, audio)
- ✅ **Release dates** and version info
- ✅ **Max output tokens** information
- ✅ **Status badges** (NEW models < 3 months, DEPRECATED)
- ✅ **Sort options** (name, provider, price, context, release date)
- ✅ **Zero friction** - no login required
- ✅ **Unlimited usage** - completely free
- ✅ **Fast loading** - optimized for speed
- ✅ **SEO optimized** - easily discoverable

### What's NOT Included (Available in TechViswa Test Bench)

- ❌ No model testing/playground
- ❌ No batch testing
- ❌ No cost calculator
- ❌ No benchmarks
- ❌ No exports
- ❌ No saved comparisons
- ❌ No user accounts

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Usage

1. **Browse Models**: Scroll through the model grid
2. **Search**: Use the search bar to find specific models
3. **Filter**: Select provider, family, or modality filters
4. **Sort**: Click sort buttons to reorder models
5. **Add to Compare**: Click "Add to Compare" (max 3 models)
6. **Compare**: Click "Compare Models" button in bottom tray
7. **View Results**: See side-by-side comparison table

---

## 📊 Model Data

All model data includes:
- Model name and provider
- Model family and version
- Context window size
- Input/output pricing (per 1M tokens)
- Max output tokens
- Supported modalities
- Release date
- Status (new, deprecated)
- API information

Data is regularly updated to reflect latest pricing and availability.

---

## 🎨 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

---

## 📱 Features Detail

### Search & Filtering
- Real-time search by model name or provider
- Filter by provider (OpenAI, Anthropic, Google, etc.)
- Filter by model family (GPT, Claude, Gemini, etc.)
- Filter by modality (text, vision, audio)

### Comparison System
- Select up to 3 models
- Floating comparison tray shows selections
- Side-by-side table view
- Clear visual highlighting of differences
- Remove models individually from tray

### Status Indicators
- **NEW badge**: Models released in last 3 months (green)
- **DEPRECATED badge**: Models being phased out (red)

### Sorting Options
- Alphabetical (A-Z or Z-A)
- Provider
- Context window size
- Input pricing (low to high or high to low)
- Release date (newest first or oldest first)

---

## 🎯 Conversion Strategy

The tool drives users to TechViswa Test Bench through:

1. **Prominent CTA**: Footer call-to-action for testing
2. **Free value**: Users get value before being asked to upgrade
3. **Natural progression**: Comparison → Testing is logical next step
4. **SEO traffic**: Organic discovery through search

Target: **2% conversion** from comparison users to paid Test Bench users

---

## 📈 Success Metrics

### Leading Indicators
- Daily active users
- Comparison actions per user
- Time on page
- Bounce rate

### Lagging Indicators
- Click-through rate on Test Bench CTA
- Conversion to Test Bench signup
- Paid conversion rate

---

## 🔧 Development

### Project Structure
  - Separate tracking for system, user, and assistant messages
  - Context window usage visualization with color-coded warnings
  - Per-request cost estimation with input/output breakdown
  - Model-specific pricing and context limits
- **Session History** - Automatic tracking of your LLM usage
  - Stores up to 1,000 sessions in your browser (100% private)
  - Time-based filtering (today, week, month, all-time)
  - Comprehensive statistics dashboard
  - Track total costs, tokens, and identify usage patterns
  - Model and provider usage distribution
  - One-click export of usage data
- **Smart Model Selection** - Choose any models for analysis
  - Search through all 150+ models
  - Add/remove models dynamically
  - Quick clear button to reset selections
  - No arbitrary limits

### 💎 Advanced Analytics & Optimization Tools (NEW in v1.0)

#### 📊 Enhanced Cost Calculator with Visual Charts
- **Beautiful Visualizations** - Interactive pie and bar charts powered by Recharts
  - Cost distribution across selected models
  - Input vs Output cost breakdowns
  - Budget vs actual cost comparisons
- **Three Powerful Modes**:
  - **Simple Calculator** - Quick cost estimation for specific token counts
  - **Monthly Projections** - Forecast costs based on conversations and usage
  - **Budget Tracker** - Set budgets and see which models exceed limits with visual alerts
- **Smart Insights**:
  - Automatic cheapest vs most expensive model identification
  - Potential savings calculator
  - Per-conversation and annual cost projections
- **Export Built-in** - Download calculations in CSV, JSON, or Markdown

#### 💡 Token Optimization Assistant
- **Intelligent Prompt Analysis** - Get efficiency scores (1-10) for your prompts
- **Automatic Optimization** - AI-powered suggestions to reduce token usage
- **Savings Calculator** - See exact token and cost savings (typically 20-40%)
- **Issue Detection**:
  - Redundant phrases and filler words
  - Excessive punctuation
  - Verbose instructions
  - High token-to-word ratios
- **Before/After Comparison** - Visual side-by-side with improvements
- **Best Practices Guide** - Learn token optimization techniques
- **One-Click Copy** - Copy optimized prompts instantly

#### 📈 Interactive Usage Dashboard
- **Multiple Visualization Views**:
  - **Overview** - Model distribution pie charts and daily activity
  - **Usage Heatmap** - Activity by hour of day to identify peak times
  - **Cost Trends** - Track spending over time with line charts
  - **Provider Analysis** - Compare costs across different providers
- **Comprehensive Statistics**:
  - Total sessions, tokens, and costs
  - Average cost per session
  - Most-used models and providers
- **Flexible Time Filters** - Today, Last 7 Days, Last 30 Days, All Time
- **Top Models Table** - Detailed breakdown of usage by model
- **Privacy-First** - All data stored locally in your browser

#### 🎯 Smart Model Recommender
- **Wizard-Style Interface** - Answer a few questions to find your perfect model
- **Task Type Selection**:
  - Creative Writing
  - Code Generation
  - Data Analysis
  - Chat/Conversation
  - Complex Reasoning
  - Translation
- **Priority Options**:
  - **Quality** - Best performance regardless of cost
  - **Cost** - Cheapest while maintaining quality
  - **Balanced** - Optimal quality-to-cost ratio
  - **Speed** - Fastest response times
- **Advanced Constraints**:
  - Maximum cost per 1M tokens
  - Minimum quality score (MMLU %)
  - Minimum context window size
- **Smart Scoring Algorithm**:
  - Match score (0-100) for each model
  - Quality-per-dollar value calculations
  - Top 5 recommendations with detailed metrics
- **One-Click Selection** - View details or add to comparison instantly

### 📥 Universal Export Functionality
- **Export from Anywhere** - Available in all major views
  - Model Details view - export single model data
  - Comparison view - export compared models
  - Cost Calculator - export calculation results
  - Enhanced Cost Calculator - export with charts data
  - Analytics - comprehensive reports
- **Multiple Formats**
  - CSV - Excel/Google Sheets compatible
  - JSON - For developers and automation
  - Markdown - Documentation-ready tables
- **Smart File Naming** - Auto-generated with timestamps
- **One-Click Download** - No complex steps required

### 🎨 Beautiful User Interface
- **Collapsible sections** - only see what you need
- **Dark mode** support with automatic theme switching
- **Responsive design** - works perfectly on mobile, tablet, and desktop
- **Keyboard shortcuts** for power users
- **Favorites** - star your most-used models
- **Search & filter** - find models instantly

### 📱 Enhanced Model Detail View
Click any model to see:
- **Export Button** - Download model data in CSV, JSON, or Markdown format
- **Status Badges** - NEW, UPDATED, or DEPRECATED indicators in header
- **Overview** - primary purpose, best use cases, key features
- **Pricing & Economics** - detailed cost breakdown with examples
- **Technical Specs** - context window, capacity, last updated
- **Performance Benchmarks** - MMLU, HumanEval, speed ratings
- **API Availability** - endpoints, authentication, rate limits, regional availability
- **Working Code Examples** - Python, JavaScript, and cURL samples (8 per model = 1,200+ total)
- **Real-World Use Cases** - Industry-specific examples with metrics (600+ scenarios)
- **Limitations & Best Practices** - Known issues, gotchas, and expert tips
- **Tags** - quick identification of model capabilities

### 📚 Official Documentation Hub (NEW in v1.2!)
**Access comprehensive documentation for all major LLM providers in one place**

- **Genre-based Organization** - Find docs by model type:
  - Chat Models (conversational AI)
  - Reasoning Models (complex problem-solving)
  - Vision & Multimodal (image understanding)
  - Coding Models (code generation)
  - Embedding Models (semantic search)
- **8 Providers Covered** - OpenAI, Anthropic, Google, Mistral, Cohere, Meta, xAI, Perplexity
- **12 Documentation Resources** - Organized by genre with model lists
- **Official Links** - Direct access to:
  - Main documentation pages
  - API reference guides
  - Pricing information
  - Model-specific details
- **Smart Search** - Find by provider, model name, or description
- **Quick Filters** - Filter by genre with visual icons
- **Always Up-to-Date** - Links to official provider sources

### 📋 Model Changelog & Tracking (NEW in v1.2!)
**Never miss important model updates and pricing changes**

- **Comprehensive Change Tracking**:
  - New model releases with full details
  - Price changes with before/after comparison
  - Deprecation warnings with timeline
  - Model updates and improvements
- **Advanced Filtering**:
  - Filter by change type (new, price, deprecation, update)
  - Filter by provider
  - Time-based filtering (today, week, month, all time)
- **Detailed Change Records**:
  - Exact change details with old/new values
  - Timestamp for each change
  - Direct links to affected models
  - Provider and model information
- **Export Capability** - Download changelog history
- **LocalStorage Persistence** - Keeps last 200 entries

### 🔔 Notifications System (NEW in v1.2!)
**Stay informed with intelligent alerts and customizable preferences**

- **Smart Notifications** for:
  - Price changes (only when exceeding your threshold)
  - New model releases from watched providers
  - Model deprecation warnings
  - Important model updates
- **Granular Preferences**:
  - Enable/disable specific notification types
  - Watch specific models by ID
  - Watch specific providers
  - Set minimum price change percentage (e.g., only notify if >5% change)
- **Multiple Channels** (configurable):
  - In-app notifications with unread badges
  - Browser notifications (when permitted)
  - Email notifications (with backend)
  - Webhook integration (with backend)
- **Notification Management**:
  - Filter by notification type
  - Mark individual or all as read
  - Delete unwanted notifications
  - View detailed change information
- **Privacy-First** - All stored locally in your browser
- **Actionable** - Direct links to view affected models

### 🎯 Improved Navigation (NEW in v1.2!)
**Enhanced user experience with organized, consistent interface**

- **Alphabetically Sorted Menu** - 12 buttons organized A-Z for easy finding
- **Responsive Grid Layout** - 6 buttons per row on desktop, adapts to mobile
- **Unified Color Scheme** - Consistent blue palette across all buttons
- **Clear Icons** - Visual identification for each feature
- **Responsive Design** - Text hidden on mobile, icons always visible
- **Button Consistency** - Uniform size, spacing, and hover effects

---

## 🚀 Quick Start

### For Users
Simply visit the live site and start exploring! No installation needed.

### For Developers

**Prerequisites:**
- Node.js 18+ installed
- npm or yarn package manager

**Installation:**

```bash
# Clone the repository
git clone <your-repo-url>
cd LLMDB

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

**Build for production:**

```bash
npm run build
npm start
```

---

## 📖 How to Use

### 1️⃣ Navigation & Quick Actions
- **Organized button menu** - 12 buttons in a responsive 6-per-row grid layout (alphabetically sorted)
- **Analytics** - Token Counter, Session History & Export
- **Calculator** - Basic cost calculator
- **Changelog** - View model updates, deprecations, and new releases
- **Charts** - Enhanced cost calculator with visualizations
- **Compare** - Side-by-side model comparison (up to 4 models)
- **Learn** - Official documentation hub for all providers organized by genre
- **Notifications** - Real-time alerts for price changes, new models, deprecations
- **Optimize** - Token optimization assistant
- **Recommend** - Smart model recommender
- **Refresh** - Check for latest model updates
- **Shortcuts** - Keyboard shortcuts reference
- **Test** - Live model testing playground

### 2️⃣ Browse Models
- View the comprehensive table of all LLM models
- Sort by **name**, **provider**, **context window**, **price**, or **quality score**
- Use the search bar to find specific models
- **Status badges** show NEW, UPDATED, or DEPRECATED models directly in the table

### 3️⃣ Advanced Search & Filter
- Click **"Advanced Search"** button for multi-criteria filtering:
  - **Providers** - filter by specific providers (OpenAI, Anthropic, Google, etc.)
  - **Model Types** - chat, completion, embedding, multimodal
  - **Capabilities** - vision, function calling, streaming, etc.
  - **Status** - find new models, recently updated pricing, or deprecated ones
  - **Features** - long context, reasoning, coding specialist, etc.
- Click **quick filter tabs** to view:
  - All models
  - Cheapest options
  - Large context models
  - Best value models
  - Your favorites
- **Star models** to add them to favorites
- **Select up to 4 models** to compare side-by-side

### 4️⃣ View Details
- Click the **ℹ️ info icon** or **View Details** button on any model
- Click **green Export button** to download model data (CSV/JSON/Markdown)
- See **status badges** (NEW/UPDATED/DEPRECATED) in the model header
- Explore organized, collapsible sections:
  - **Overview** - what the model is good for
  - **Pricing & Economics** - detailed cost breakdown
  - **Context & Performance** - technical specifications
  - **Best For** - recommended use cases
  - **Key Features** - unique capabilities
  - **API Integration** - endpoints, authentication, rate limits, docs
  - **Working Code Examples** - Python, JavaScript, cURL (expand to see)
  - **Real-World Use Cases** - Industry examples with metrics (expand to see)
  - **Limitations & Best Practices** - Gotchas and expert tips (expand to see)
  - **Tags** - model capabilities
- **Copy code** with one click
- **Expand/collapse** sections for easier navigation

### 5️⃣ Track Usage & Costs
- Click **"Analytics"** button (gradient blue-purple in header)
- **Token Counter Tab**:
  - Enter system instructions, user prompts, and expected responses
  - See real-time token counts with accurate GPT tokenization
  - View context window usage with color-coded warnings (green/yellow/red)
  - Get instant cost estimates for each request
- **Session History Tab**:
  - View all your token calculations automatically saved
  - Filter by time (today, week, month, all-time)
  - See comprehensive statistics (total cost, tokens, most-used model)
  - Track usage patterns and spending trends
  - Export your usage data
- **Export & Reports Tab**:
  - Export selected models in CSV, JSON, or Markdown
  - Generate comprehensive usage reports
  - Download session history data
- **Model Selection**:
  - Click "Add/Remove Models" to select any models from database
  - Search through 150+ models by name or provider
  - Clear button to quickly reset selections

### 6️⃣ Calculate Costs
- Click **"Calculator"** button (basic calculator)
- Add models for cost calculation
- Enter your expected token usage
- See estimated costs for selected models
- Click **green Export button** to download calculation results

### 7️⃣ Enhanced Cost Calculator with Charts (NEW!)
- Click **"Cost Charts"** button (green gradient in header)
- Select models from the comprehensive list
- Choose mode:
  - **Simple** - Calculate costs for specific token counts
  - **Monthly** - Project monthly and annual costs based on usage patterns
  - **Budget** - Set a budget and see which models fit
- View beautiful interactive charts:
  - Pie charts showing cost distribution
  - Bar charts comparing input/output costs
  - Budget tracking visualizations
- Get instant insights on cheapest vs most expensive models
- Export all data with one click

### 8️⃣ Optimize Your Prompts (NEW!)
- Click **"Optimize"** button (purple-pink gradient in header)
- Paste your prompt in the text area
- Get instant efficiency score (1-10)
- See detected issues and optimization suggestions
- View optimized version with token savings
- Copy optimized prompt with one click
- Learn best practices for token efficiency

### 9️⃣ Find the Perfect Model (NEW!)
- Click **"Find Model"** button (amber-orange gradient in header)
- Select your task type (Creative Writing, Code, Analysis, etc.)
- Choose priority (Quality, Cost, Balanced, or Speed)
- Set constraints:
  - Maximum cost per 1M tokens
  - Minimum quality score
  - Minimum context window
- Click "Find Best Models"
- Review top 5 recommendations with match scores
- Click to view details or add to comparison

### 🔟 Test Models Live (NEW in v1.1!)
- Click **"Test Models"** button (pink-rose gradient in header)
- Enter API keys for providers (OpenAI, Anthropic, Google)
  - **Maximum Privacy**: Keys are NEVER stored - you must enter them each session
  - Only kept in memory while playground is open
  - Never sent to our servers - requests go directly to providers
- Select up to 4 models to test simultaneously
- Configure settings:
  - Max tokens (1-4000)
  - Temperature (0-2)
- Enter your test prompt
- Click "Test All Models" to run live tests
- View side-by-side results with:
  - Response time (milliseconds)
  - Actual cost based on real token usage
  - Complete model responses
  - Token usage breakdown
- Rate quality of each response (1-5 stars)
- Save tests to history for future reference
- Export results as JSON
- Quick stats show fastest, cheapest, and highest-rated models

**How it helps users:**
- **Test before committing**: Try models with your actual prompts before making decisions
- **Real performance data**: See actual response times and costs, not estimates
- **Side-by-side comparison**: Compare responses quality directly
- **Cost transparency**: Know exact costs based on actual token usage
- **Performance tracking**: Save and compare tests over time
- **Quality validation**: Rate and track which models work best for your use case

### 1️⃣1️⃣ Official Documentation Hub (NEW!)
- Click **"Learn"** button to access comprehensive documentation
- **Genre-based Organization**:
  - Chat Models (GPT, Claude, Gemini, etc.)
  - Reasoning Models (o1, o1-mini, etc.)
  - Vision & Multimodal (Claude 3.5 Sonnet, Gemini Pro, etc.)
  - Coding Models (Codestral, Mistral Large, etc.)
  - Embedding Models (Cohere Embed, etc.)
- **8 Providers Covered**: OpenAI, Anthropic, Google, Mistral, Cohere, Meta, xAI, Perplexity
- **Official Links for Each Provider**:
  - Main Documentation
  - API Reference
  - Pricing Information
  - Model Details (when available)
- **Search Functionality**: Find documentation by provider, model, or description
- **Genre Filters**: Quick filtering by model type
- **Direct Access**: All links open to official provider documentation

### 1️⃣2️⃣ Model Changelog & Updates (NEW!)
- Click **"Changelog"** button to view model update history
- **Filter by Type**:
  - New Models - Recently released models
  - Price Changes - Pricing updates with before/after comparison
  - Deprecations - Models being phased out
  - Model Updates - Feature additions and improvements
- **Comprehensive Details**: See exactly what changed and when
- **Provider Filtering**: View changes for specific providers
- **Time-based Filters**: Today, This Week, This Month, All Time
- **Export Capability**: Download changelog data

### 1️⃣3️⃣ Notifications System (NEW!)
- Click **"Notifications"** button to manage alerts
- **Real-time Notifications** for:
  - Price changes (with configurable minimum threshold)
  - New model releases
  - Model deprecations
  - Important model updates
- **Notification Preferences**:
  - Configure which types of alerts you want
  - Watch specific models or providers
  - Set minimum price change percentage
  - Enable browser notifications (optional)
  - Email notifications (optional)
  - Webhook integration (optional)
- **Filter & Organize**: View by notification type
- **Mark as Read/Delete**: Manage your notification history
- **Actionable**: Direct links to affected models

### 1️⃣4️⃣ Compare Models
- Select up to 4 models for comparison
- Click **"Compare"** button
- View side-by-side comparison with benchmarks and costs
- Click **green Export button** to download comparison data

### ⌨️ Keyboard Shortcuts
Press **?** to see all keyboard shortcuts:
- `/` - Focus search
- `c` - Toggle calculator
- `?` - Show keyboard help

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Interactive data visualizations |
| **GPT-Tokenizer** | Accurate token counting |
| **PapaParse** | CSV export functionality |
| **Lucide React** | Beautiful icons |
| **Vercel** | Deployment platform |

---

## 🎨 Features in Detail

### Cost Calculator
Estimate your monthly LLM costs based on:
- Expected monthly token usage
- Input/output token ratio
- Model pricing
- Real-time calculations

### Quality Scoring
We calculate quality scores using:
- **MMLU (Massive Multitask Language Understanding)** - 60% weight
- **HumanEval (Coding Capability)** - 40% weight
- Normalized to 0-10 scale
- Color-coded badges (green = excellent, blue = good, etc.)

### Code Examples
Every model includes **8 working code samples**:

**Python (3 examples):**
- Basic Chat Completion - Simple request with system/user messages
- Streaming Response - Real-time output streaming
- Function Calling - Tool use and function invocation

**JavaScript (3 examples):**
- Basic Chat Completion - Async/await patterns
- Streaming Response - For-await streaming
- Error Handling - Production-ready error management

**cURL (2 examples):**
- Basic Request - Command-line testing
- Streaming Request - Server-sent events

All examples include:
- **Provider-specific SDKs** (OpenAI, Anthropic, Google, etc.)
- **Correct authentication** patterns
- **Working imports** and initialization
- **Syntax highlighting** with dark mode
- **Copy-to-clipboard** functionality

### Supported Providers
OpenAI • Anthropic • Google • Meta • Mistral • Cohere • AWS • Azure • xAI • DeepSeek • Perplexity • Together AI • Groq • Fireworks • Anyscale • Replicate • Alibaba • Baidu • Tencent • Zhipu • MiniMax • Moonshot • AI21 • Databricks • Nvidia • Reka • Hugging Face • Stability AI • Microsoft • Amazon • Intel • IBM • and many more...

---

## 🛠️ Customization

### Adding New Models

Edit `app/data/llm-data.ts`:

```typescript
{
  id: "model-id",
  name: "Model Name",
  provider: "Provider Name",
  contextWindow: 128000,
  inputCostPer1M: 10.00,
  outputCostPer1M: 30.00,
  releaseDate: "2024-11-08",
  description: "Model description",
  strengths: ["Complex tasks", "Long documents", "High performance"],
  apiInfo: {
    endpoint: "https://api.provider.com/v1/chat/completions",
    authentication: "API Key (Bearer token)",
    rateLimits: "10,000 TPM on tier 1",
    regionalAvailability: "Global",
    documentation: "https://docs.provider.com/api"
  },
  status: {
    isNew: true,
    pricingUpdated: true,
    pricingUpdateDate: "2024-11-08"
  }
}
```

### Updating Pricing

Pricing is in `app/data/llm-data.ts`. Update `inputCostPer1M` and `outputCostPer1M` fields. When updating pricing, also update the status badge:

```typescript
status: {
  pricingUpdated: true,
  pricingUpdateDate: "2025-11-08"  // Today's date
}
```

### Styling

Customize in:
- `tailwind.config.ts` - Colors, spacing, fonts
- `app/globals.css` - Global styles and CSS variables

---

## 📦 Project Structure

```
LLMDB/
├── app/
│   ├── api/
│   │   └── test-model/
│   │       └── route.ts                    # 🆕 API endpoint for live model testing
│   ├── [modelId]/
│   │   └── page.tsx                        # Model detail page
│   ├── components/
│   │   ├── ModelDetailsCard.tsx            # Enhanced model card with Phase 1 features
│   │   ├── Phase1Features.tsx              # Code examples, use cases, limitations
│   │   ├── MobileModelCard.tsx             # Mobile-responsive card view
│   │   ├── AdvancedSearch.tsx              # Multi-criteria search & filtering
│   │   ├── EnhancedModelComparison.tsx     # Side-by-side model comparison (up to 4)
│   │   ├── Sprint1Dashboard.tsx            # Analytics dashboard (token counter, history)
│   │   ├── ExportButton.tsx                # Universal export component
│   │   ├── EnhancedCostCalculator.tsx      # 🆕 Cost calculator with charts
│   │   ├── TokenOptimizationAssistant.tsx  # 🆕 Prompt optimization tool
│   │   ├── InteractiveUsageDashboard.tsx   # 🆕 Advanced analytics dashboard
│   │   ├── SmartModelRecommender.tsx       # 🆕 Intelligent model finder
│   │   ├── ModelTestingPlayground.tsx      # 🆕 Live model testing playground (v1.1)
│   │   ├── ModelDocumentationHub.tsx       # 🆕 Official docs hub organized by genre (v1.2)
│   │   ├── ModelChangelog.tsx              # 🆕 Model update history and changelog (v1.2)
│   │   ├── NotificationsPanel.tsx          # 🆕 Notifications system (v1.2)
│   │   └── NotificationPreferences.tsx     # 🆕 Notification settings (v1.2)
│   ├── data/
│   │   ├── llm-data.ts                     # All model data (150 models)
│   │   ├── phase1-data-generator.ts        # Dynamic Phase 1 content generation
│   │   └── enriched-models.ts              # Models with Phase 1 features
│   ├── types/
│   │   ├── features.ts                     # TypeScript types
│   │   ├── playground.ts                   # 🆕 Testing playground types
│   │   └── notifications.ts                # 🆕 Notification system types (v1.2)
│   ├── utils/
│   │   ├── modelRecommendations.ts         # Smart model suggestions
│   │   ├── sessionStorage.ts               # 🆕 LocalStorage manager for sessions
│   │   └── exportUtils.ts                  # 🆕 Export utilities (CSV/JSON/Markdown)
│   ├── services/
│   │   └── notificationService.ts          # 🆕 Notification management service (v1.2)
│   ├── globals.css                         # Global styles
│   ├── layout.tsx                          # Root layout
│   └── page.tsx                            # Main table view with v1.0 features
├── components/                              # Additional components
├── public/                                  # Static assets
├── next.config.mjs                         # Next.js config
├── tailwind.config.ts                      # Tailwind config
└── package.json                            # Dependencies
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**Option 1: Via GitHub**
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

**Option 2: Via CLI**
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
- **Netlify**: Connect GitHub repo and deploy
- **Railway**: Import from GitHub
- **Self-hosted**: Run `npm run build` and serve `.next` folder

---

## 🌟 Use Cases

### For Developers
- Compare API pricing before choosing a provider
- Get working Python code instantly
- Calculate monthly costs based on usage
- Find models with specific context windows

### For Researchers
- Compare benchmark scores across models
- Identify best models for specific tasks
- Track latest model releases
- Understand capability differences

### For Businesses
- Estimate LLM infrastructure costs
- Compare quality vs price trade-offs
- Find most cost-effective options
- Plan for scale with context window info

### For Students
- Learn about different LLM providers
- Understand pricing models
- Access Python integration examples
- Explore latest AI models

---

## 🎯 Roadmap

### ✅ v1.0 - Recently Completed
- [x] **Enhanced Cost Calculator with Charts**: Interactive visualizations with pie/bar charts, budget tracking
- [x] **Token Optimization Assistant**: AI-powered prompt analysis with 20-40% savings
- [x] **Interactive Usage Dashboard**: Advanced analytics with heatmaps, trends, and provider analysis
- [x] **Smart Model Recommender**: Intelligent wizard to find the perfect model for any task
- [x] **Enhanced Token Counter**: Accurate tokenization with real-time cost estimation
- [x] **Session History & Analytics**: Track usage, costs, and patterns over time
- [x] **Universal Export**: Export from any view (Model Details, Comparison, Calculator, Analytics)
- [x] **Smart Model Selection**: Search and select from all 150+ models with quick clear option
- [x] **1,200+ Code Examples**: Python, JavaScript, and cURL samples for all models
- [x] **600+ Use Cases**: Real-world industry scenarios with metrics
- [x] **150 Limitation Guides**: Comprehensive best practices and gotchas
- [x] **Mobile Responsive Design**: Perfect UX on all devices
- [x] **Collapsible Sections**: Clean, organized modal dialogs
- [x] API Availability Information (endpoints, auth, rate limits)
- [x] Model Status Indicators (NEW, UPDATED, DEPRECATED badges)
- [x] Advanced Search & Filtering (multi-criteria)
- [x] Enhanced Model Comparison (up to 4 models)
- [x] Database cleanup (150 curated production models)

### 🎯 v1.1 - Completed
- [x] **Model Performance Testing Playground**: Test models live with your API keys directly in-browser

### 🎯 v1.2 - Just Completed
- [x] **Model Documentation Hub**: Official documentation organized by genre for all 8 providers
- [x] **Model Changelog**: Track model updates, price changes, deprecations, and new releases
- [x] **Notifications System**: Real-time alerts for price changes, new models, and deprecations
- [x] **Notification Preferences**: Granular control over notification types, watched models/providers
- [x] **Organized Button Menu**: Alphabetically sorted 6-per-row responsive grid layout
- [x] **Unified Color Scheme**: Consistent blue color palette across all navigation buttons

### 📋 v2.0 - Planned Features
- [ ] **Context Window Management**: Smart truncation and conversation splitting tools
- [ ] **PDF Export**: Generate professional reports with charts
- [ ] **Scheduled Reports**: Daily/weekly/monthly email summaries
- [ ] **User Reviews & Ratings**: Community-driven insights
- [ ] **Community Prompts Library**: Share and discover effective prompts
- [ ] **Real News Feed**: Automated model updates from provider APIs
- [ ] **Custom Comparison Templates**: Save and share model comparison sets
- [ ] **Advanced Notification Channels**: Email and webhook integrations (backend required)
- [ ] **Historical Pricing Data**: Track pricing trends over time
- [ ] **Provider Status Monitoring**: Real-time uptime and performance tracking
- [ ] **Multi-language Support**: Internationalization for global users
- [ ] **API Rate Limit Tracker**: Monitor your API usage across providers

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Adding Models
Please ensure new models include:
- Accurate pricing from official sources
- Context window size
- Benchmark scores (if available)
- Proper provider attribution
- Release date
- **API information** (endpoint, authentication, rate limits, regional availability, documentation)
- **Status badges** (isNew for 2024-2025 releases, pricingUpdated with date)
- Model strengths and description
- Only **real production models** - no fake or placeholder entries

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Pricing data** sourced from official provider documentation
- **Benchmark scores** from published research papers and official announcements
- **Icons** by [Lucide](https://lucide.dev/)
- **Framework** by [Next.js](https://nextjs.org/)
- **Styling** by [Tailwind CSS](https://tailwindcss.com/)

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Updates**: Follow for latest model additions

---

## ⚠️ Disclaimer

**Pricing and Model Information**: Updated regularly but may not always reflect the latest changes. Please verify critical information with official provider documentation.

**Code Examples**: Provided for illustrative and educational purposes. Test thoroughly before using in production.

**Real-World Use Cases**: Illustrative examples based on common use patterns. Actual results may vary. Consult vendor documentation for verified case studies.

**Limitations & Best Practices**: General guidance based on common patterns. Always refer to official provider documentation for the most current information.

This tool is for informational purposes only.

---

Made with ❤️ by Sriram Srinivasan

**Version**: 1.2
**Last Updated**: November 10, 2025

---

## 📊 Database Statistics

**Models & Coverage:**
- **150 production models** across 39 providers
- **100% API coverage** - every model has complete API information
- **122 NEW models** - released in 2024-2025
- **81 models** with recent pricing updates
- **Latest additions**: o1, o3-mini, Codestral, Gemini 2.0 Flash, DeepSeek V3, Gemma 2 9B/27B

**Phase 1 Content (NEW):**
- **1,200+ code examples** (8 per model × 150 models)
- **600+ use case scenarios** (3-5 per model)
- **150 comprehensive limitation guides**
- **3 programming languages** supported (Python, JavaScript, cURL)
- **7 industry verticals** covered
