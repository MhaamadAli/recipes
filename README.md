# 🍽️ Recipe Management System with AI Suggestions

A modern, full-featured recipe management application built with **Next.js 15**, **TypeScript**, and **OpenAI integration**. Manage your favorite recipes, discover new ones with AI-powered suggestions, and organize your culinary collection with ease.

![Recipe Management System](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-green?style=for-the-badge&logo=openai)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🔥 Core Features
- **📝 Recipe Management**: Add, edit, delete, and organize recipes
- **🏷️ Status Tagging**: Mark recipes as "Favorite", "To Try", or "Made Before"
- **🔍 Advanced Search**: Filter by name, ingredients, cuisine type, or preparation time
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Updates**: Instant UI updates with optimistic loading

### 🤖 AI-Powered Features
- **🧠 Smart Recipe Suggestions**: AI generates recipes based on available ingredients
- **🎯 Intelligent Recommendations**: Considers dietary preferences and time constraints
- **🔄 Fallback System**: Works even when AI service is unavailable
- **🎨 Creative Recipes**: OpenAI creates unique, practical recipes

### 🎨 User Experience
- **🌙 Modern UI**: Clean, intuitive interface with Tailwind CSS
- **⚡ Fast Performance**: In-memory storage for instant responses
- **🛡️ Type Safety**: Full TypeScript coverage prevents runtime errors
- **🔔 Error Handling**: Graceful error recovery and user feedback

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **AI Integration**: OpenAI GPT-3.5-turbo API
- **Storage**: In-memory storage (easily extensible to database)
- **API**: RESTful API routes with Next.js

### Project Structure
```
recipe-management/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── recipes/              
│   │   │   └── route.ts          # Recipe CRUD operations
│   │   └── ai/
│   │       └── recipe-suggestions/
│   │           └── route.ts      # AI suggestions endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard
├── components/                   # React components
│   ├── RecipeCard.tsx           # Recipe display card
│   ├── RecipeForm.tsx           # Add/edit recipe form
│   ├── RecipeSuggestions.tsx    # AI suggestions modal
│   └── SearchBar.tsx            # Search and filter component
├── lib/                         # Utility libraries
│   ├── types.ts                 # TypeScript type definitions
│   └── data.ts                  # Data storage (if using external file)
├── .env.local                   # Environment variables
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn**
- **OpenAI API Key** (optional, for AI features)

### Installation

1. **Clone or create the project**
   ```bash
   npx create-next-app@latest recipe-management --typescript --tailwind --app
   cd recipe-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install openai  # For AI features
   ```

3. **Set up environment variables**
   Create `.env.local` in the project root:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

4. **Add the project files**
   Copy all the provided component files into their respective directories:
   - `app/page.tsx`
   - `app/layout.tsx`
   - `app/api/recipes/route.ts`
   - `app/api/ai/recipe-suggestions/route.ts`
   - `components/RecipeCard.tsx`
   - `components/RecipeForm.tsx`
   - `components/RecipeSuggestions.tsx`
   - `components/SearchBar.tsx`
   - `lib/types.ts`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage Guide

### Adding Recipes

1. **Manual Entry**
   - Click "Add Recipe" button
   - Fill in recipe details:
     - Name, ingredients, instructions
     - Cuisine type, difficulty, prep time
     - Servings and optional tags
   - Save to add to your collection

2. **AI-Generated Recipes**
   - Click "🤖 AI Suggestions"
   - Enter available ingredients (e.g., "chicken, rice, onions")
   - Add preferences (e.g., "vegetarian, under 30 minutes")
   - Select from AI-generated suggestions
   - Review and edit before saving

### Managing Recipes

- **Edit**: Click "Edit" on any recipe card
- **Delete**: Click "Delete" (with confirmation)
- **Change Status**: Use dropdown to mark as Favorite/To Try/Made
- **Search**: Use the search bar to filter recipes
- **Filter**: Apply cuisine, status, or time filters

### Search & Discovery

- **Text Search**: Search by recipe name, ingredients, or tags
- **Cuisine Filter**: Filter by cuisine type (Italian, Mexican, etc.)
- **Status Filter**: Show only favorites, to-try, or made recipes
- **Time Filter**: Find recipes under a certain prep time
- **Combined Filters**: Use multiple filters simultaneously

## 🤖 AI Features

### How AI Suggestions Work

1. **Ingredient Analysis**: AI analyzes your available ingredients
2. **Recipe Generation**: Creates complete recipes with:
   - Realistic ingredient lists with quantities
   - Step-by-step cooking instructions
   - Appropriate cuisine categorization
   - Accurate prep times and servings
3. **Preference Integration**: Considers dietary restrictions and time constraints
4. **Quality Validation**: Ensures recipes are practical and cookable

### AI Configuration

#### Using OpenAI (Recommended)
```env
OPENAI_API_KEY=sk-your-key-here
```

#### Fallback Mode
If no API key is provided, the system uses smart ingredient-based suggestions.

### AI Prompting Strategy
The system uses carefully crafted prompts to ensure:
- **Practical recipes** that can actually be cooked
- **Ingredient utilization** that maximizes use of available ingredients
- **Variety** in cuisine types and difficulty levels
- **Proper formatting** for consistent recipe structure

## 🔧 API Reference

### Recipe Endpoints

#### Get All Recipes
```http
GET /api/recipes
```

#### Search Recipes
```http
GET /api/recipes?query=chicken&cuisineType=Italian&status=favorite&maxPrepTime=30
```

#### Create Recipe
```http
POST /api/recipes
Content-Type: application/json

{
  "name": "Recipe Name",
  "ingredients": "ingredient1, ingredient2",
  "instructions": "step1\nstep2",
  "cuisineType": "Italian",
  "preparationTime": 30,
  "servings": 4,
  "difficulty": "Easy",
  "tags": "tag1, tag2"
}
```

#### Update Recipe
```http
PUT /api/recipes?id=recipe-id
Content-Type: application/json

{
  "name": "Updated Recipe Name",
  // ... other fields
}
```

#### Update Recipe Status
```http
PUT /api/recipes?id=recipe-id
Content-Type: application/json

{
  "status": "favorite"
}
```

#### Delete Recipe
```http
DELETE /api/recipes?id=recipe-id
```

### AI Suggestion Endpoints

#### Generate Suggestions
```http
POST /api/ai/recipe-suggestions
Content-Type: application/json

{
  "ingredients": "chicken, rice, onions, garlic",
  "preferences": "quick, under 30 minutes, Asian cuisine"
}
```

#### Health Check
```http
GET /api/ai/recipe-suggestions
```

## 🎨 Customization

### Adding New Features

1. **Database Integration**
   - Replace in-memory storage with Prisma + PostgreSQL
   - Update `lib/data.ts` with database operations

2. **User Authentication**
   - Add NextAuth.js for user management
   - Implement user-specific recipe collections

3. **Image Upload**
   - Integrate with Cloudinary or AWS S3
   - Add image fields to recipe model

4. **Advanced AI Features**
   - Nutrition analysis with AI
   - Ingredient substitution suggestions
   - Meal planning automation

### Styling Customization

The app uses Tailwind CSS with a consistent design system:

```css
/* Primary Colors */
.bg-blue-500    /* Primary action buttons */
.bg-purple-500  /* AI-related features */
.bg-green-500   /* Success states */
.bg-red-500     /* Delete/error states */

/* Status Colors */
.bg-red-100     /* Favorite recipes */
.bg-yellow-100  /* To-try recipes */
.bg-green-100   /* Made recipes */
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a new recipe manually
- [ ] Edit an existing recipe
- [ ] Delete a recipe (with confirmation)
- [ ] Change recipe status
- [ ] Search recipes by name
- [ ] Filter by cuisine type
- [ ] Filter by preparation time
- [ ] Generate AI suggestions
- [ ] Select and save an AI suggestion
- [ ] Test mobile responsiveness

### API Testing

Test endpoints directly:
```bash
# Test recipe API
curl http://localhost:3000/api/recipes

# Test AI API health
curl http://localhost:3000/api/ai/recipe-suggestions
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Add environment variables**
   - `OPENAI_API_KEY`: Your OpenAI API key
3. **Deploy**
   ```bash
   npm run build
   ```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify**: Add build command `npm run build`
- **Railway**: Add environment variables
- **DigitalOcean**: Use App Platform with Node.js

## 🔐 Environment Variables

```env
# Required for AI features
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: For production database
DATABASE_URL=postgresql://username:password@localhost:5432/recipes

# Optional: For authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### Common Issues

1. **405 Method Not Allowed**
   - Ensure API route files are named `route.ts`
   - Check that HTTP methods are properly exported

2. **AI Suggestions Not Working**
   - Verify OpenAI API key in `.env.local`
   - Check API key has sufficient credits
   - Review browser network tab for errors

3. **TypeScript Errors**
   - Run `npm run type-check`
   - Ensure all required props are passed to components

4. **Import Path Issues**
   - Use relative imports if `@/` paths don't work
   - Check `tsconfig.json` path configuration

### Debug Mode

Enable detailed logging:
```typescript
// Add to any API route
console.log('Debug info:', { request, data });
```

## 🤝 Contributing

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes**
   - Follow TypeScript best practices
   - Add proper error handling
   - Update types as needed

3. **Test thoroughly**
   - Test all CRUD operations
   - Verify AI functionality
   - Check mobile responsiveness

4. **Submit pull request**

### Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **API**: RESTful conventions with proper HTTP status codes

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Review browser console for errors**
3. **Verify API endpoints work directly**
4. **Check environment variable configuration**

## 🔮 Future Enhancements

### Planned Features
- **User Authentication**: Multi-user support with NextAuth.js
- **Recipe Sharing**: Public recipe collections and social features
- **Meal Planning**: AI-powered weekly meal planning
- **Shopping Lists**: Auto-generated grocery lists
- **Nutrition Analysis**: Detailed nutritional information
- **Voice Commands**: Recipe reading and timer controls
- **Recipe Import**: Import from popular recipe websites
- **Offline Support**: PWA capabilities for offline access

### Technical Improvements
- **Database Migration**: PostgreSQL with Prisma ORM
- **Caching**: Redis for improved performance
- **Image Processing**: Recipe photo upload and optimization
- **Search Enhancement**: Elasticsearch for advanced search
- **Analytics**: Recipe popularity and usage tracking

---

**Built with ❤️ using Next.js, TypeScript, and OpenAI**

*Happy cooking! 👨‍🍳👩‍🍳*