# Mobile Responsive Enhancement for Dev Sangeet

The goal is to make the Dev Sangeet web application look like a native mobile app when running on Android. Currently, the UI uses large font sizes and fixed paddings that are optimized for desktop, causing layout issues on smaller screens.

## User Review Required

> [!IMPORTANT]
> The changes focus on CSS media queries to adjust the layout for screens smaller than 768px (tablets and phones). No functional logic in `script.js` will be altered.

## Proposed Changes

### Web UI

#### [MODIFY] [style.css](file:///D:/Antigravity/MUSIC PLAYER/dev-sangeet/public/style.css)
Add comprehensive media queries to:
- Scale down the main title (`.hindi-title`) and subtitles.
- Adjust the top navigation bar for mobile (stacking or simplifying).
- Reduce padding in the music player card and sections to maximize screen usage.
- Resize the deity carousel image for smaller viewports.
- Optimize the "About" section grid and FAQ layout for vertical scrolling on mobile.

## Verification Plan

### Manual Verification
- Deploy the app to an Android emulator or device.
- Verify that the title is readable and doesn't overflow.
- Check that the music player card fits within the screen width.
- Ensure the top bar doesn't overlap with the device status bar or notch (Capacitor usually handles this, but CSS helps).
- Scroll through the "About" section to ensure all text is legible and well-spaced.
