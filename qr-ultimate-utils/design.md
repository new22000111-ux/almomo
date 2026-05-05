# QR Ultimate Utils - Mobile App Design

## Overview
A comprehensive QR code utility application with a sleek dark theme and Arabic interface. The app enables users to scan, analyze, create, edit, and customize QR codes with full history tracking.

## Design Principles
- **Dark Theme**: Elegant black and purple/blue color scheme for reduced eye strain
- **Arabic-First Interface**: All text and UI flows optimized for RTL (right-to-left) languages
- **Mobile Portrait (9:16)**: One-handed usage with thumb-friendly tap targets
- **Smooth Navigation**: Seamless transitions between screens with intuitive tab bar
- **Apple HIG Compliance**: iOS-native feel with proper spacing, typography, and interactions

## Color Palette
| Token | Light | Dark (Primary) | Usage |
|-------|-------|---|---|
| `background` | #ffffff | #0a0e27 | Screen background |
| `surface` | #f5f5f5 | #1a1f3a | Cards, elevated surfaces |
| `foreground` | #11181c | #e8eaed | Primary text |
| `muted` | #687076 | #9ba1a6 | Secondary text |
| `primary` | #7c3aed | #9d4edd | Accent/tint (purple) |
| `secondary` | #3b82f6 | #60a5fa | Secondary accent (blue) |
| `border` | #e5e7eb | #2d3748 | Borders/dividers |
| `success` | #22c55e | #4ade80 | Success states |
| `warning` | #f59e0b | #fbbf24 | Warning states |
| `error` | #ef4444 | #f87171 | Error states |

## Screen List

### 1. **Home Screen** (QR Scanner)
- **Purpose**: Main entry point with quick QR scanning capability
- **Content**:
  - Large camera preview area (safe for notch)
  - Scanning indicator with animated pulse
  - Torch toggle button (top-right)
  - Gallery import button (top-left)
  - Recent scans quick access (bottom sheet)
- **Functionality**:
  - Real-time QR code detection
  - Auto-trigger on valid QR detection
  - Manual capture button as fallback
  - Haptic feedback on successful scan

### 2. **QR Analyzer Screen**
- **Purpose**: Display detailed analysis of scanned QR code
- **Content**:
  - QR code preview (centered, medium size)
  - QR type badge (URL, Text, WiFi, vCard, Email, Phone, SMS)
  - Detailed data display (varies by type):
    - **URL**: Link preview, domain, open button
    - **Text**: Full text content, copy button
    - **WiFi**: SSID, security type, password visibility toggle
    - **vCard**: Contact details (name, phone, email, address)
    - **Email**: To, subject, body preview
    - **Phone**: Phone number, call button
    - **SMS**: Number, message preview
  - Action buttons: Copy, Share, Edit, Save to History
  - Customization button (leads to QR Customization)

### 3. **QR Creator Screen**
- **Purpose**: Create new QR codes from scratch
- **Content**:
  - Type selector (segmented control or dropdown):
    - URL
    - Text
    - WiFi
    - vCard
    - Email
    - Phone
    - SMS
  - Dynamic form based on selected type
  - Generate button
  - Preview of generated QR code
  - Save, Share, Copy buttons
- **Functionality**:
  - Form validation before generation
  - Real-time QR preview
  - Save to history automatically

### 4. **QR Editor Screen**
- **Purpose**: Modify existing QR code content
- **Content**:
  - Original QR code display (top)
  - Editable form fields (pre-filled with original data)
  - Type change option (if applicable)
  - Generate Updated QR button
  - Preview of new QR code
  - Save, Replace, Share buttons
- **Functionality**:
  - Preserves original in history
  - Creates new entry for edited version
  - Form validation

### 5. **QR History Screen**
- **Purpose**: Browse and manage all scanned/created QR codes
- **Content**:
  - List of QR code entries with:
    - QR thumbnail
    - Type badge
    - Content preview (truncated)
    - Timestamp
    - Favorite/pin indicator
  - Search/filter bar (by type, date, content)
  - Sort options (recent, oldest, type, alphabetical)
  - Swipe actions: Delete, Favorite, Share
- **Functionality**:
  - Tap to view details
  - Long-press for quick actions
  - Bulk delete option
  - Export history (JSON/CSV)

### 6. **QR Customization Screen**
- **Purpose**: Customize QR code appearance
- **Content**:
  - QR code preview (center)
  - Color customization:
    - Foreground color picker (QR pattern)
    - Background color picker
    - Gradient option toggle
  - Logo/Image options:
    - Upload image button
    - Logo position selector (center, corners)
    - Logo size slider
    - Logo opacity slider
  - Shape options:
    - Pattern style (square, rounded, dots)
    - Corner style (square, rounded, circle)
  - Apply, Preview, Save buttons
- **Functionality**:
  - Real-time preview updates
  - Preset color schemes
  - Download customized QR code

### 7. **Settings Screen** (Tab 5)
- **Purpose**: App configuration and preferences
- **Content**:
  - Theme toggle (Light/Dark)
  - Language selector (Arabic/English)
  - History settings:
    - Auto-save history toggle
    - History retention (days)
    - Clear history button
  - Camera settings:
    - Vibration toggle
    - Sound toggle
    - Torch default state
  - Export/Import:
    - Export history
    - Import history
  - About:
    - App version
    - Privacy policy link
    - Terms of service link
    - Contact/feedback

## Key User Flows

### Flow 1: Scan and Analyze QR Code
1. User opens app → Home screen with camera
2. User points camera at QR code
3. App auto-detects and vibrates
4. User taps to confirm or auto-triggers
5. App navigates to Analyzer screen
6. User sees detailed breakdown of QR content
7. User can: Copy, Share, Edit, Customize, or Save

### Flow 2: Create New QR Code
1. User taps "Create" tab
2. User selects QR type from dropdown
3. User fills in form fields
4. User taps "Generate"
5. App displays preview
6. User can: Save, Share, Copy, or Customize

### Flow 3: Edit Existing QR Code
1. User scans or selects QR from history
2. User taps "Edit" button
3. App navigates to Editor screen
4. User modifies form fields
5. User taps "Generate Updated"
6. User sees new QR preview
7. User can: Save, Replace, or Share

### Flow 4: Customize QR Code
1. User has QR code (scanned or created)
2. User taps "Customize" button
3. User adjusts colors, logo, shape
4. Real-time preview updates
5. User taps "Apply"
6. User can: Download, Share, or Save

### Flow 5: Browse History
1. User taps "History" tab
2. User sees list of all QR codes
3. User can: Search, Filter, Sort
4. User taps entry to view details
5. User can: Delete, Share, Edit, or Customize

## Tab Bar Structure
| Tab | Icon | Screen | Purpose |
|-----|------|--------|---------|
| 1 | Camera | Scanner | Scan QR codes |
| 2 | Plus | Creator | Create QR codes |
| 3 | Edit | Editor | Edit QR codes |
| 4 | Clock | History | Browse history |
| 5 | Gear | Settings | App settings |

## Typography
- **Headings**: System font, 24-28px, bold (700)
- **Subheadings**: System font, 18-20px, semibold (600)
- **Body**: System font, 16px, regular (400)
- **Small**: System font, 14px, regular (400)
- **Captions**: System font, 12px, regular (400)

## Spacing & Layout
- **Safe area padding**: 16px on sides, 12px top/bottom
- **Card padding**: 12-16px
- **Button height**: 48px (minimum tap target)
- **Icon size**: 24px (standard), 32px (large)
- **Corner radius**: 12-16px (standard), 8px (small)

## Interactions
- **Tap feedback**: Scale 0.97 + haptic light
- **Long-press**: Show context menu with actions
- **Swipe**: Delete/favorite actions on list items
- **Pull-to-refresh**: Refresh history list
- **Keyboard dismiss**: Tap outside input fields

## Accessibility
- **Minimum contrast**: 4.5:1 for text
- **Touch targets**: 48x48px minimum
- **Font scaling**: Supports dynamic type
- **VoiceOver**: All elements labeled
- **RTL Support**: Full Arabic interface support
