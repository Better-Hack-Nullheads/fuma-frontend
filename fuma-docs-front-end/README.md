# Dynamic Documentation Viewer

A modern documentation frontend that dynamically fetches and renders MDX files from a backend API. Built with React, TypeScript, Vite, and Fumadocs.

## Features

- 🔄 **Dynamic MDX Rendering**: Fetches and renders MDX content from backend API
- 📱 **Responsive Design**: Two-column layout with collapsible sidebar
- 🔍 **Document Navigation**: Sidebar lists all available documents
- ⚡ **Real-time Refresh**: Refresh button to re-fetch documents
- 🎨 **Modern UI**: Built with Fumadocs components and Tailwind CSS
- 🚨 **Error Handling**: Graceful error states and loading indicators
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## Backend API Requirements

The application expects your backend to expose two endpoints:

### 1. Get All Documents
```
GET /llmresponse/getall
```
Returns an array of document objects:
```json
[
  { "id": "doc1", "content": "getting-started.mdx" },
  { "id": "doc2", "content": "api-reference.mdx" }
]
```

### 2. Get Document Content
```
GET /llmresponse/:id
```
Returns the raw MDX content as a string for the specified document ID.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Configure Backend**
   - Ensure your backend is running and accessible
   - Update API endpoints in `app/lib/api.ts` if needed
   - The app expects the backend to be available at the same origin

## Project Structure

```
app/
├── components/
│   ├── Sidebar.tsx          # Document navigation sidebar
│   └── DocViewer.tsx        # MDX content renderer
├── lib/
│   └── api.ts               # Backend API integration
├── routes/
│   ├── docs/
│   │   ├── index.tsx        # Documents listing page
│   │   └── [id].tsx         # Individual document viewer
│   └── home.tsx             # Landing page
└── ...
```

## Usage

1. **Browse Documents**: Visit `/docs` to see all available documents
2. **View Document**: Click on any document to view its content
3. **Refresh**: Use the refresh button to reload documents from the backend
4. **Navigate**: Use the sidebar to switch between documents

## Customization

### Styling
- The app uses Tailwind CSS for styling
- Fumadocs components provide the base UI framework
- Customize colors and layout in the component files

### MDX Components
- Add custom MDX components in `app/components/DocViewer.tsx`
- The app includes basic markdown parsing with support for:
  - Headings (H1-H4)
  - Bold and italic text
  - Inline code and code blocks
  - Paragraphs

### API Configuration
- Modify `app/lib/api.ts` to change API endpoints
- Add authentication headers if needed
- Implement caching or other optimizations

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

### Tech Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Fumadocs** - Documentation UI components
- **Tailwind CSS** - Utility-first CSS framework
- **MDX** - Markdown with JSX support

## Troubleshooting

### Common Issues

1. **Backend Connection Errors**
   - Ensure your backend is running
   - Check CORS settings if running on different ports
   - Verify API endpoint URLs

2. **MDX Rendering Issues**
   - Check that your MDX content is valid
   - Ensure proper frontmatter format if using it
   - Check browser console for compilation errors

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check that Fumadocs components are imported correctly
   - Verify responsive breakpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.