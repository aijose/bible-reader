# Deployment Guide

This Bible Reader application is configured for deployment on Netlify and Vercel free tiers.

## Prerequisites

Before deploying, ensure all data files are generated:

```bash
# Generate Bible data
node scripts/download_asv_working.js

# Generate embeddings (requires Python with uv)
cd scripts && uv run python generate_embeddings.py

# Build similarity matrix
node scripts/build_similarity_matrix.js
```

## Netlify Deployment

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**: 
   - Build command: `npm run build` (auto-detected from netlify.toml)
   - Publish directory: `dist` (auto-detected from netlify.toml)
3. **Deploy**: Netlify will automatically build and deploy

### Manual Netlify Deploy

```bash
# Build the application
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir dist
```

## Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Build Settings**: Auto-detected from vercel.json
3. **Deploy**: Vercel will automatically build and deploy

### Manual Vercel Deploy

```bash
# Build the application
npm run build

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Performance Considerations

- **Bundle Size**: ~192KB main bundle + ~60KB gzipped
- **Data Files**: Cached with 24-hour expiry
- **Service Worker**: Enables offline Bible reading
- **Mobile Optimized**: Responsive design with bottom sheet on mobile

## Post-Deployment

1. Test the deployed application thoroughly
2. Verify all data files load correctly
3. Test mobile responsiveness
4. Ensure RAG system works in production
5. Monitor performance and loading times

## Free Tier Limitations

- **Netlify Free**: 100GB bandwidth/month, 300 build minutes/month
- **Vercel Free**: 100GB bandwidth/month, 6000 serverless function executions/month
- Both platforms provide excellent performance for this static application

## Troubleshooting

If deployment fails:
1. Check that all data files exist in `public/data/`
2. Verify build completes locally with `npm run build`
3. Ensure Node.js version compatibility (18+)
4. Check deployment logs for specific errors