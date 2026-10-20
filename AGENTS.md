# SDGs Interactive Digital Exhibition

## Project goal

Create a polished, responsive static website for an interactive digital curation of the United Nations Sustainable Development Goals (SDGs). Aim for the craft, clarity, and originality associated with Awwwards-recognized work; do not claim or imply that the site has won an award unless it actually has.

## Product and design direction

- Treat the site as a digital exhibition: guide visitors through a clear sequence of spaces, stories, and actions.
- Make the experience work across mobile, tablet, and desktop sizes, including touch, keyboard, and assistive-technology use.
- Keep motion purposeful and provide a reduced-motion experience that respects `prefers-reduced-motion`.
- Use GSAP and ScrollTrigger for exhibition transitions and scroll-led effects. Keep effects performant, avoid blocking access to content, and clean up or rebuild scroll animations when layouts change.
- Use semantic HTML, accessible labels, visible focus states, and adequate contrast.
- Do not add application code until the user asks to begin implementation.

## Data and feedback

- The site is static and hosted on GitHub Pages. Submit visitor feedback through a Google Apps Script Web App endpoint that records responses in Google Sheets.
- Do not use or install Clasp. The user will create and deploy the Apps Script directly in the browser.
- Read the public Web App URL from the `VITE_APPS_SCRIPT_URL` environment variable. Keep the local value in an ignored `.env` file; never commit credentials or private data.
- Make the feedback form validate input and communicate loading, success, and failure states. Do not claim a response was recorded until the endpoint confirms success.
- Keep the spreadsheet and Apps Script configuration steps documented for the user when integration work begins.

## Build and deployment

- Use Vite for the static build, pnpm for package management, and GSAP as the animation dependency.
- The GitHub Pages workflow builds the site into `dist/` and deploys it with GitHub Actions. Use relative asset paths so the site works both at a project Pages URL and at a custom domain.
- Use GitHub CLI (`gh`) for GitHub repository and Pages administration, and Git for local version control operations.
- After a successful deployment, add the actual GitHub Pages URL to `README.md`, then commit and push that README update to the repository.
- Do not create or publish a GitHub repository until its name and visibility are clear from the user's instructions.

## Current setup boundary

The repository is being prepared before site implementation. Do not create HTML, CSS, JavaScript, TypeScript, or other application code until the user gives the next instruction.
