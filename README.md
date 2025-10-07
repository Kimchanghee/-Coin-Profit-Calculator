<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/11qeskxhB7UkSO-t6BweSVn-1H1ttTYzg

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure environment variables in [.env.local](.env.local):
   - `GEMINI_API_KEY` – your Gemini API key
   - `VITE_ADSENSE_CLIENT_ID` – Google AdSense client ID (optional)
   - `VITE_ADSENSE_SLOT_SIDEBAR_TOP` / `VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM` – Ad slot IDs used in the sidebar (optional)
   - `VITE_GA_MEASUREMENT_ID` – Google Analytics 4 measurement ID (optional)
3. Run the app:
   `npm run dev`
