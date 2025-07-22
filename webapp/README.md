# Thinkerbell Semantic Intelligence Web App

A modern React-based web application for AI-powered content classification and strategic framework generation.

![Thinkerbell Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)

## 🚀 Features

- **Real-time Semantic Classification**: AI-powered content analysis with instant feedback
- **Strategic Framework Generation**: Transform unstructured content into Hunch/Wisdom/Nudge/Spell frameworks
- **Interactive Dashboard**: Comprehensive analytics and processing history
- **Template Management**: Flexible content templates for different output formats
- **Live Preview**: Real-time content processing with confidence indicators
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ and npm
- Running Thinkerbell API server (see main project README)

## 🛠️ Installation

1. **Navigate to the webapp directory:**
   ```bash
   cd webapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   ```
   http://localhost:3001
   ```

## 🏗️ Project Structure

```
webapp/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   └── favicon.ico        # App icon
├── src/
│   ├── components/        # Reusable UI components
│   │   └── Navbar.js      # Navigation component
│   ├── context/           # React context providers
│   │   └── SemanticContext.js  # Global state management
│   ├── pages/             # Page components
│   │   ├── Dashboard.js   # Main dashboard
│   │   ├── Playground.js  # Interactive content processor
│   │   ├── Analytics.js   # Data visualization
│   │   ├── Templates.js   # Template management
│   │   ├── Settings.js    # Configuration
│   │   └── About.js       # Project information
│   ├── services/          # API communication
│   │   └── api.js         # HTTP client configuration
│   ├── App.js             # Main application component
│   ├── App.css            # Application styles
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## 🎨 Key Components

### Dashboard
- **Overview metrics** and processing statistics
- **Quick actions** for common tasks
- **Recent activity** display
- **System status** indicators

### Playground
- **Interactive content input** with real-time processing
- **Live classification** with confidence scores
- **Smart suggestions** for content improvement
- **Export capabilities** (copy, download)

### Analytics
- **Visual charts** showing processing patterns
- **Performance metrics** and trends
- **Category distribution** analysis
- **Export functionality** for data analysis

### Templates
- **Template library** with preview capabilities
- **Template selection** and management
- **Category organization** (Presentation, Strategy, Creative, Analytics)
- **Import/export** functionality

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the webapp directory:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_VERSION=1.0.0
```

### API Configuration
The webapp connects to the Thinkerbell API server. Ensure the main API is running:

```bash
# In the main project directory
npm run api:start
```

## 🎯 Usage Examples

### Processing Content
1. Navigate to the **Playground** page
2. Enter your content in the text area
3. Select a template (Slide Deck, Strategy Doc, etc.)
4. Click **Process with AI**
5. View real-time classification and formatted output

### Viewing Analytics
1. Go to the **Analytics** page
2. Explore processing history and performance metrics
3. Export data for further analysis
4. Monitor confidence levels and category distributions

### Managing Templates
1. Visit the **Templates** page
2. Browse available templates by category
3. Preview template structure and formatting
4. Select templates for your content processing

## 🚀 Production Build

1. **Create optimized build:**
   ```bash
   npm run build
   ```

2. **Serve static files:**
   ```bash
   npx serve -s build -l 3001
   ```

## 🧪 Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (not recommended)

## 🎨 Design System

### Colors
- **Primary**: Indigo (`#6366f1`)
- **Secondary**: Purple (`#8b5cf6`)
- **Success**: Green (`#10b981`)
- **Warning**: Yellow (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Font weights 600-700
- **Body**: Font weight 400
- **Code**: Fira Code monospace

### Components
- **Cards**: Rounded corners (`rounded-xl`) with subtle shadows
- **Buttons**: Consistent padding and hover states
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion for smooth transitions

## 🔗 Integration

### API Endpoints
The webapp communicates with these API endpoints:

- `GET /health` - System health check
- `POST /process` - Main content processing
- `POST /preview` - Real-time preview generation
- `POST /explain` - Classification explanations
- `POST /suggestions` - Smart content suggestions
- `GET /templates` - Available templates
- `GET /stats` - System statistics

### State Management
Global state is managed through React Context:

- **SemanticContext**: Main application state
- **Local Storage**: Settings persistence
- **Session Storage**: Temporary data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the Thinkerbell Semantic Intelligence suite. See the main project LICENSE for details.

## 🆘 Support

- **Documentation**: See main project README
- **Issues**: Report bugs via GitHub Issues
- **Features**: Request features via GitHub Discussions

---

Built with ❤️ for strategic thinking and AI-powered content generation. 