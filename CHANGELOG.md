# Changelog

All notable changes to Mail Template Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-07

### 🎉 Initial Release

First stable release of Mail Template Builder - A modern email template builder with TinyMCE integration.

### ✨ Features

#### Editor
- **TinyMCE 7.6.0 Integration**
  - Professional WYSIWYG rich text editor
  - Full formatting capabilities (bold, italic, underline, fonts, colors)
  - Table and list support
  - HTML source code editing
  - Media embedding
  - Special characters insertion
  - Self-hosted (no CDN dependencies)
  - Dark mode theme support (oxide/oxide-dark)
  - No promotion banner
  - Email-optimized settings

#### Template Management
- Create and edit email templates
- Template categorization (Newsletter, Marketing, Transactional, Onboarding, Promotional, Announcement)
- Custom tagging system for organization
- Template duplication functionality
- Search and filter capabilities
- Export templates as standalone HTML files
- Live preview in new window
- Template metadata (name, subject, description, category, tags)

#### User Interface
- **Modern Design**
  - Built with Tailwind CSS v4
  - Clean and intuitive interface
  - Responsive layout for all devices
  - shadcn/ui component library

- **Dark Mode**
  - Full dark mode support
  - System preference detection
  - Manual theme switching (Light/Dark/System)
  - Persistent theme preference
  - TinyMCE editor theme integration

- **Modular Sidebar**
  - Collapsible navigation (256px ↔ 80px)
  - Smooth collapse/expand animation
  - Persistent state with localStorage
  - Search functionality
  - Animated dropdown menus
  - 6 modular components:
    - SidebarHeader - Avatar and toggle
    - SidebarUserMenu - Profile dropdown
    - SidebarSearch - Search input
    - SidebarMenuItem - Menu with submenus
    - SidebarFooter - System status
    - menuItems.ts - Configuration

- **Enhanced Login Page**
  - Show/hide password toggle with Eye/EyeOff icons
  - Consistent input heights (48px)
  - Clean focus states (no outline ring)
  - Better UX with larger touch targets
  - Email and password validation

- **Modular Profile Page**
  - 4 separate components:
    - ProfileHeader - Page header with logout
    - ProfileAvatar - Avatar with online status
    - ProfileCard - Profile information
    - ProfileStatsCard - Stats and quick actions
  - Account statistics display
  - Quick action buttons
  - Profile settings dialog

#### Authentication & Security
- Secure user authentication
- Email and password login
- Protected routes with automatic redirection
- Persistent sessions across browser sessions
- User profile management
- Zustand state management with persistence

#### Image Handling
- Direct image upload through TinyMCE
- Server storage in `/public/uploads/images/`
- Image URL embedding in templates
- Upload API endpoint at `/api/upload`

#### Merge Tags Support
- Dynamic variable support:
  - `{{name}}` - Recipient's name
  - `{{email}}` - Recipient's email
  - `{{company}}` - Company name
  - `{{date}}` - Current date
  - `{{url}}` - Custom URL
- Easy insertion directly in editor

### 🛠️ Technical Stack

#### Frontend
- Next.js 16.0.0 (App Router)
- React 19.2.0
- TypeScript 5.x
- Tailwind CSS v4

#### Editor & UI
- TinyMCE 7.6.0
- @tinymce/tinymce-react 5.1.1
- shadcn/ui components
- Radix UI primitives
- Lucide React icons

#### State Management
- Zustand 5.0.8
- Zustand persist middleware

#### Utilities
- date-fns 4.1.0 - Date manipulation
- react-hot-toast 2.6.0 - Notifications

### 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd mail-template-builder

# Install dependencies
npm install --legacy-peer-deps

# TinyMCE files auto-copied during postinstall

# Run development server
npm run dev
```

### 🔧 Configuration

- **Self-hosted TinyMCE**: Files automatically copied to `/public/tinymce/`
- **Storage**: JSON-based file storage for templates and users
- **Dark Mode**: CSS custom properties in globals.css
- **No environment variables required**

### 📚 Documentation

Comprehensive README.md included with:
- Installation guide
- Usage instructions
- Configuration details
- Project structure
- Development guidelines
- Deployment guide

### 🎯 Project Structure

Modular architecture with separated concerns:
- `/src/app/` - Next.js pages and API routes
- `/src/components/` - Reusable React components
  - `/auth/` - Authentication components
  - `/editor/` - Editor components
  - `/layout/` - Sidebar and layout (7 files)
  - `/profile/` - Profile page (4 files)
  - `/templates/` - Template management
  - `/ui/` - shadcn/ui components
- `/src/stores/` - Zustand state stores
- `/src/types/` - TypeScript definitions
- `/public/tinymce/` - Self-hosted TinyMCE
- `/scripts/` - Build automation

### 🐛 Known Issues

- JSON-based storage not suitable for production scale
- Server image storage increases disk usage
- Consider database migration for production use
- Consider cloud storage for images (Cloudinary, AWS S3)

### 🚀 Performance

- Build time: ~2-3 seconds
- Bundle size optimized (GrapeJS removed)
- Lazy loading for components
- Image optimization recommended for production

### 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers supported

### 🔐 Security

- Secure authentication flow
- Protected API routes
- Input validation
- XSS prevention in templates
- File upload restrictions

### 📄 License

MIT License - See LICENSE file for details

### 🙏 Credits

- Next.js Team - React framework
- TinyMCE - Rich text editor
- Vercel - Hosting platform
- shadcn - UI components
- Tailwind Labs - CSS framework

---

## Development Notes

### Migration from Previous Versions

This is the first stable release. No migration required.

### Breaking Changes

None - Initial release

### Deprecated Features

None - Initial release

### Future Roadmap

See README.md for planned features and improvements.

---

**Release Date**: December 7, 2025
**Release Type**: Major Release
**Build Status**: ✅ Stable
**Documentation**: Complete

For detailed information, see [README.md](README.md)
