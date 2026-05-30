# Mahlzeit Am Meer Theme

Custom OctoberCMS theme for the **Mahlzeit Am Meer** restaurant in Cuxhaven Duhnen, Germany.

A modern, feature-rich restaurant website theme built on OctoberCMS with Bootstrap 4, featuring online reservations, menu displays, event management, and location booking capabilities.

![Preview](./preview.png?raw=true "Preview")

## About

This theme powers the official website of Mahlzeit Am Meer, a traditional restaurant with over 100 years of history located directly at the Duhner beach in Cuxhaven. The theme provides a complete solution for restaurant operations including:

- **Online Reservations** - Table booking system
- **Menu Display** - Digital menu presentations with flipbook technology
- **Event Management** - Firebase-powered calendar and event booking
- **Location Booking** - Room and venue booking for private events
- **Photo Galleries** - Visual showcase of dishes and ambiance
- **Contact Forms** - Customer inquiry handling
- **Team Page** - Staff presentation
- **History** - Restaurant tradition and heritage

Visit the live website: [mahlzeit-am-meer.de](https://mahlzeit-am-meer.de)

## Features

### Restaurant-Specific Components
- Table reservation system
- Digital menu flipbooks
- Event calendar and booking
- Location/venue booking for private events
- Breakfast buffet information
- Contact and inquiry forms
- Team presentation
- Restaurant history and story
- Gallery showcase
- Walking path animations
- Interactive video backgrounds

### Technical Features
- **Bootstrap 4** - Responsive framework with custom Sass variables
- **Firebase Integration** - Real-time event and calendar management
- **Barba.js** - Smooth page transitions
- **GSAP Animations** - Advanced motion graphics
- **PhotoSwipe** - Touch-friendly image galleries
- **Custom Iconsets** - Restaurant-specific iconography
- **Rivets.js** - Data binding for dynamic content

## Bootstrap 4 Customization

To make it possible to use Bootstrap 4 Sass files directly, we use a modified version of Bootstrap 4 called [Bootstrap 4 Backward](https://github.com/JumpLinkNetwork/bootstrap-backward).

### Runtime Variable Customization

All Bootstrap 4 variables can be fully customized at runtime through OctoberCMS theme settings:

![Theme Settings Panel](./theme_settings.png?raw=true "Theme Settings")

The theme settings panel allows you to adjust colors, typography, spacing, and all other Bootstrap variables without touching source code.

## Development

### Prerequisites

- Node.js and npm
- Bower

### Installation

Install developer dependencies:

```bash
npm install
bower install
```

### Building

Compile Sass to CSS (dart-sass):

```bash
npm run style
```

Generate documentation:

```bash
npm run doc
```

### Project Structure

```
mahlzeit-october-theme/
├── assets/           # Theme assets (CSS, JS, images, videos)
│   ├── css/         # Compiled CSS
│   ├── javascript/  # JavaScript components
│   ├── scss/        # Sass source files
│   ├── images/      # Images and graphics
│   └── videos/      # Video assets
├── content/         # Content files (HTML pages)
├── layouts/         # Theme layouts
├── pages/           # Page definitions
├── partials/        # Reusable components
└── utilities/       # Build scripts
```

## Content Areas

The theme includes pre-built content sections for:

- **Homepage** - Landing page with hero section and featured content
- **Menus** - Multi-format menu presentations
- **Reservations** - Booking interface
- **Events** - Calendar and event listing
- **Location** - Venue booking and information
- **Team** - Staff showcase
- **History** - Restaurant heritage
- **Contact** - Forms and inquiry handling
- **Legal** - Terms, privacy policy, imprint

## Credits

Built by [JumpLink Network](https://www.jumplink.eu) for Mahlzeit Am Meer.