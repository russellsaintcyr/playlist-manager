# GitHub Pages Deployment Guide for Angular 17

Your app is already configured for GitHub Pages! Here's what's set up and what else you should consider:

## ✅ Already Configured

### 1. **BaseHref Set Correctly**
In `angular.json`:
```json
"baseHref": "/playlist-webapp/"
```
This is correct for deploying to `https://russellsaintcyr.github.io/playlist-webapp/`

### 2. **Hash-Based Routing**
Your `app.module.ts` uses:
```typescript
{
  provide: LocationStrategy,
  useClass: HashLocationStrategy,
}
```
This is perfect for GitHub Pages since it avoids server-side routing issues.

### 3. **Production Build Optimized**
Your production configuration is excellent:
- `optimization: true` - Minifies code
- `outputHashing: all` - Cache busting
- `sourceMap: false` - Smaller bundle size
- `buildOptimizer: true` - Additional optimizations

## 📋 Recommended Additional Changes

### 1. **Add .nojekyll File**
GitHub Pages uses Jekyll by default, which can interfere with Angular apps. Create:

**File: `.nojekyll`** (in root directory)
```
# This file tells GitHub Pages to bypass Jekyll processing
```

This prevents GitHub from trying to process your dist folder.

### 2. **Update package.json Scripts**
Add GitHub Pages deployment scripts:

Current `package.json` scripts should include:
```json
{
  "scripts": {
    "build:gh-pages": "ng build --configuration production",
    "deploy": "npm run build:gh-pages && npx angular-cli-ghpages --dir=dist/zzz"
  }
}
```

### 3. **Install angular-cli-ghpages**
```bash
npm install --save-dev angular-cli-ghpages
```

This simplifies GitHub Pages deployment.

### 4. **Add 404.html for SPA Routing**
GitHub Pages doesn't handle deep linking well for SPAs. Create:

**File: `src/404.html`** (will be copied to dist)
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Spotify Playlist Rater</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
      // Redirect all 404s to index.html with hash routing
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/playlist-webapp/'">
  </head>
  <body>
  </body>
</html>
```

Add to `angular.json` assets:
```json
"assets": [
  "src/assets",
  "src/favicon.ico",
  "src/404.html"
]
```

### 5. **Update index.html for GitHub Pages**
Your current index.html looks good, but ensure:
- ✅ `<base href="/">` is set (it gets overridden by baseHref in angular.json during build)
- ✅ Charset is set
- ✅ Viewport is responsive

Your current setup is already correct! ✅

### 6. **Update Environment Configuration**
In `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  baseUrl: 'https://api.spotify.com/v1',
  // For GitHub Pages URLs
  appBaseUrl: 'https://russellsaintcyr.github.io/playlist-webapp'
};
```

### 7. **Add GitHub Actions Workflow (Optional but Recommended)**
Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Angular app
        run: npm run build:gh-pages
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/zzz
          cname: playlist-webapp.example.com  # Optional: if using custom domain
```

This automates deployment on every push to master.

## 🚀 Deployment Steps

### Manual Deployment:

```bash
# 1. Build for production
npm run build:gh-pages

# 2. Deploy to GitHub Pages
npm run deploy

# Or manually:
npx angular-cli-ghpages --dir=dist/zzz
```

### Using GitHub Actions (Recommended):

1. Create `.github/workflows/deploy.yml` (see above)
2. Push to master
3. GitHub Actions automatically builds and deploys
4. Check "Settings" → "Pages" in your GitHub repo to verify deployment

## 📝 Repository Settings

In GitHub repository settings:
1. Go to **Settings** → **Pages**
2. Select **Deploy from a branch**
3. Choose branch: **gh-pages** (created by deployment)
4. Folder: **/ (root)**
5. Click **Save**

Optional: Add custom domain if you have one

## ✨ Optimization Tips

### 1. **Enable Gzip Compression**
GitHub Pages automatically serves gzipped assets. No action needed! ✓

### 2. **Lazy Loading Routes**
For better performance, lazy load your routes in `app-routing.module.ts`:

```typescript
const routes: Routes = [
  {
    path: 'playlist',
    loadChildren: () => import('./components/playlist/playlist.component').then(m => m.PlaylistComponent)
  },
  // ... other routes
];
```

### 3. **Code Splitting**
Angular 17 automatically splits vendor code. Ensure it's enabled in production config. ✓

### 4. **Service Worker (Optional)**
For offline support, add Angular Service Worker:

```bash
ng add @angular/service-worker
```

## 🔍 Verification Checklist

- [ ] `baseHref` is set to `/playlist-webapp/` in angular.json
- [ ] `.nojekyll` file created in root
- [ ] `404.html` created in src/
- [ ] angular-cli-ghpages installed
- [ ] Build scripts added to package.json
- [ ] GitHub Pages enabled in repository settings
- [ ] Build and deployment successful
- [ ] App accessible at https://russellsaintcyr.github.io/playlist-webapp/

## 🐛 Troubleshooting

### Issue: App loads but routes don't work
**Solution**: Ensure hash routing is enabled (it is! ✓)

### Issue: Assets not loading (404 errors)
**Solution**: Check that `baseHref` matches your repository name

### Issue: Static assets not showing
**Solution**: Ensure assets are in `angular.json` and copied to dist

### Issue: Slow initial load
**Solution**: 
- Check bundle size: `npm install -g webpack-bundle-analyzer`
- Lazy load routes
- Enable production mode

## 📚 Resources

- [Angular Deployment Docs](https://angular.io/guide/deployment)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Angular CLI ghpages](https://github.com/angular-eslint/angular-cli-ghpages)

## Summary

Your app is **already well-configured** for GitHub Pages! The main additions I recommend:

1. ✅ Create `.nojekyll` file
2. ✅ Create `src/404.html` file  
3. ✅ Add deployment scripts to package.json
4. ✅ Install `angular-cli-ghpages`
5. ✅ (Optional) Set up GitHub Actions workflow

Would you like me to implement any of these?
