# JobTrac Browser Extension

Save jobs in one click. Auto-extracts company, role, location, salary & job description from LinkedIn, Indeed, Glassdoor & Naukri into your JobTrac dashboard.

## Features

- **One-Click Import**: Extract job details automatically from job posting pages
- **Supported Sites**:
  - LinkedIn Jobs
  - Indeed
  - Glassdoor
  - Naukri
  - Generic company career pages (uses JSON-LD structured data)
- **Auto-Detection**: Automatically detects company, role, location, salary, and job description
- **Quick Edit**: Review and edit extracted data before saving
- **Theme Support**: Light, Dark & AMOLED modes
- **Keyboard Shortcuts**: `Ctrl+Shift+J` (Mac) / `Alt+Shift+J` (Windows/Linux) to open

## Installation

### Development Build

1. Navigate to the extension directory:
   ```bash
   cd extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `extension/dist` folder

### Icons

The extension uses `jtrac-logo.png` from `public/icons/`. The build process automatically copies icons to the dist folder.

## Usage

1. Navigate to any job posting page (LinkedIn, Indeed, Glassdoor, Naukri, or company career page)
2. Click the JobTrac extension icon in your browser toolbar
3. Review the extracted job details
4. Optionally adjust status, priority, and add notes
5. Click "Save to JobTrac" to import the application

## Architecture

```
extension/
├── manifest.json           # Chrome extension manifest v3
├── popup.html              # Popup entry point
├── src/
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Shared types
│   ├── utils/              # Utilities
│   │   ├── index.ts        # Parser exports
│   │   └── parsers/        # Site-specific parsers
│   │       ├── linkedin.ts
│   │       ├── indeed.ts
│   │       ├── glassdoor.ts
│   │       ├── naukri.ts
│   │       └── generic.ts  # Fallback parser
│   ├── storage/            # Chrome storage API wrapper
│   │   └── index.ts
│   ├── background/         # Service worker
│   │   └── service-worker.ts
│   ├── content.ts          # Content script
│   └── popup/              # React popup UI
│       ├── Popup.tsx
│       ├── popup.css
│       └── index.tsx
└── public/
    └── icons/              # Extension icons
```

## Adding New Site Parsers

To add support for a new job site:

1. Create a new parser in `src/utils/parsers/`:
   ```typescript
   import { ExtractedJobData, JobParser } from '../types';

   export const newSiteParser: JobParser = {
     name: 'NewSite',
     matches: (url: string) => url.includes('newsite.com'),
     extract: (): ExtractedJobData | null => {
       // Extract job data from DOM
       return {
         company: '...',
         role: '...',
         // ...
       };
     },
   };
   ```

2. Add to `src/utils/index.ts`:
   ```typescript
   import { newSiteParser } from './parsers/newsite';

   export const parsers: JobParser[] = [
     // ... existing parsers
     newSiteParser,
     genericParser, // Keep generic last
   ];
   ```

3. Update `manifest.json` content_scripts matches:
   ```json
   "content_scripts": [{
     "matches": [
       // ... existing
       "https://www.newsite.com/*"
     ]
   }]
   ```

## Future Features (Phase 2)

- [ ] Direct Firebase integration (save without opening JobTrac)
- [ ] Session capture (save all open tabs for interview prep)
- [ ] YouTube timestamp capture
- [ ] AI chat export detection
- [ ] Browser sync across devices
