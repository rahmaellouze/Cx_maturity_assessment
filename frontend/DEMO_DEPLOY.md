Demo deployment

This frontend can be built in a backend-free demo mode for stakeholder review.

Included in demo mode:
- Landing page
- Start assessment page
- First profiling form page after clicking `Begin assessment`

Not included in demo mode:
- Backend persistence
- Dynamic questionnaire loading from API
- Scoring submission
- Results generation

Commands

```powershell
cd C:\Users\barbo\OneDrive\Bureau\cx_maturity_framework\frontend
npm.cmd run build:demo
```

This creates a static demo build in:

```text
frontend\dist
```

Recommended deployment option

- Vercel

Vercel deployment

Option 1: Vercel dashboard

1. Push the repository to GitHub, GitLab, or Bitbucket
2. Import the repository into Vercel
3. Vercel will detect [vercel.json](C:/Users/barbo/OneDrive/Bureau/cx_maturity_framework/vercel.json) at the repo root
4. Deploy

Option 2: Vercel CLI

```powershell
cd C:\Users\barbo\OneDrive\Bureau\cx_maturity_framework
npx vercel
```

For production:

```powershell
cd C:\Users\barbo\OneDrive\Bureau\cx_maturity_framework
npx vercel --prod
```

What the Vercel config does

- installs dependencies from `frontend`
- builds the backend-free demo mode
- serves `frontend/dist`
- rewrites routes to `index.html` so React Router works on refresh

Demo behavior

- The start form uses built-in mock sectors
- Clicking `Begin assessment` opens a mocked first profiling page
- The demo intentionally stops there so feedback can focus on UX and content
