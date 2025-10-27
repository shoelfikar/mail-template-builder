# Email Template Builder - Blueprint & Implementation Guide

## 📋 MVP Scope

### Core Features
1. **HTML Email Editor** - Drag & drop atau WYSIWYG editor
2. **Template Management** - CRUD templates
3. **Preview** - Live preview email template
4. **Export** - Export ke HTML
5. **Variable/Merge Tags** - Dynamic content ({{name}}, {{email}}, etc)

---

## 🏗️ Tech Stack & Packages

### Core Framework
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x"
}
```

### Email Editor Options (Pilih salah satu)
**Option A: Drag & Drop Builder**
- `@react-email/components` - React components untuk email
- `grapesjs` + `grapesjs-preset-newsletter` - Drag & drop builder
- `unlayer/react-email-editor` - Komersial tapi bagus

**Option B: Code Editor dengan Preview**
- `@monaco-editor/react` - Code editor (VS Code)
- `react-simple-code-editor` - Lightweight alternative
- `codemirror` - Code editor

**Rekomendasi: Option A dengan GrapeJS atau react-email**

### UI Components
```json
{
  "shadcn/ui": "latest",
  "lucide-react": "^0.x",
  "react-hot-toast": "^2.x",
  "zustand": "^4.x"
}
```

### Email Processing
```json
{
  "mjml": "^4.x",
  "juice": "^10.x",
  "html-to-text": "^9.x",
  "nodemailer": "^6.x"
}
```

### Database & Storage (Optional untuk MVP)
```json
{
  "prisma": "^5.x",
  "@prisma/client": "^5.x"
}
```

---

## 📁 Project Structure

```
mail-template-builder/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── editor/
│   │   │   └── page.tsx                 # Main editor page
│   │   ├── templates/
│   │   │   ├── page.tsx                 # Template list
│   │   │   └── [id]/page.tsx            # Template detail
│   │   └── api/
│   │       ├── templates/
│   │       │   ├── route.ts             # GET, POST templates
│   │       │   └── [id]/route.ts        # GET, PUT, DELETE template
│   │       └── export/
│   │           └── route.ts             # Export HTML
│   ├── components/
│   │   ├── editor/
│   │   │   ├── EmailEditor.tsx          # Main editor component
│   │   │   ├── EditorToolbar.tsx        # Toolbar actions
│   │   │   ├── ComponentPanel.tsx       # Drag components
│   │   │   └── StylePanel.tsx           # Style settings
│   │   ├── preview/
│   │   │   ├── EmailPreview.tsx         # Live preview
│   │   │   └── DevicePreview.tsx        # Mobile/Desktop view
│   │   ├── templates/
│   │   │   ├── TemplateCard.tsx
│   │   │   ├── TemplateGrid.tsx
│   │   │   └── TemplateSidebar.tsx
│   │   └── ui/                          # shadcn components
│   ├── lib/
│   │   ├── email/
│   │   │   ├── compiler.ts              # MJML to HTML
│   │   │   ├── inliner.ts               # Inline CSS (juice)
│   │   │   └── validator.ts             # Validate email HTML
│   │   ├── storage/
│   │   │   └── templates.ts             # Template CRUD
│   │   └── utils/
│   │       ├── mergeVars.ts             # Handle {{variables}}
│   │       └── sanitize.ts              # Sanitize HTML
│   ├── stores/
│   │   └── editorStore.ts               # Zustand store
│   ├── types/
│   │   └── template.ts                  # TypeScript interfaces
│   └── styles/
│       └── globals.css
├── public/
│   └── templates/                       # Default templates
├── prisma/
│   └── schema.prisma                    # DB schema (optional)
└── package.json
```

---

## 🔄 Application Flow

### 1. Template Management Flow
```
User → Templates List → [Create New / Edit Existing]
                     ↓
              Email Editor
                     ↓
         [Build Template with Components]
                     ↓
              Live Preview
                     ↓
         [Save / Export HTML]
```

### 2. Editor Flow
```
1. Load Editor
   ↓
2. Select Components (Header, Text, Image, Button, etc)
   ↓
3. Drag to Canvas
   ↓
4. Configure Styles (Colors, Fonts, Spacing)
   ↓
5. Add Merge Tags ({{name}}, {{company}})
   ↓
6. Preview (Desktop/Mobile)
   ↓
7. Save Template
   ↓
8. Export HTML (with inlined CSS)
```

### 3. Data Flow
```
Editor Component
    ↓
Zustand Store (State Management)
    ↓
API Routes
    ↓
Storage (File System / Database)
    ↓
Export Service (MJML → HTML → Inline CSS)
```

---

## 🎨 Blueprint Architecture

### Core Components Architecture

```typescript
// Template Interface
interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  html: string;          // Raw HTML/MJML
  compiledHtml?: string; // Compiled with inlined CSS
  thumbnail?: string;
  variables: string[];   // ['name', 'email', 'company']
  createdAt: Date;
  updatedAt: Date;
}

// Editor State
interface EditorState {
  template: EmailTemplate | null;
  isPreviewMode: boolean;
  selectedDevice: 'desktop' | 'mobile';
  isDirty: boolean;

  // Actions
  loadTemplate: (id: string) => void;
  updateTemplate: (html: string) => void;
  saveTemplate: () => void;
  exportHtml: () => string;
}
```

### Component Hierarchy
```
App
├── TemplatesPage
│   ├── TemplateGrid
│   │   └── TemplateCard (multiple)
│   └── CreateButton
│
└── EditorPage
    ├── EditorToolbar
    │   ├── SaveButton
    │   ├── ExportButton
    │   └── PreviewToggle
    ├── EditorLayout
    │   ├── ComponentPanel (left sidebar)
    │   ├── Canvas (main editor)
    │   └── StylePanel (right sidebar)
    └── PreviewPanel
        └── DevicePreview
```

---

## 🚀 Step-by-Step Implementation

### Phase 1: Project Setup (Day 1)
```bash
# 1. Initialize Next.js project
npx create-next-app@latest mail-template-builder --typescript --tailwind --app

# 2. Install core dependencies
npm install @react-email/components grapesjs grapesjs-preset-newsletter
npm install zustand react-hot-toast lucide-react

# 3. Install email processing
npm install mjml juice html-to-text

# 4. Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog
```

### Phase 2: Basic Structure (Day 1-2)
1. ✅ Create folder structure
2. ✅ Setup TypeScript interfaces (`types/template.ts`)
3. ✅ Create Zustand store (`stores/editorStore.ts`)
4. ✅ Setup basic routing (templates list, editor)
5. ✅ Create UI layout with Tailwind

### Phase 3: Template Management (Day 2-3)
1. ✅ Create template list page
2. ✅ Implement file-based storage (`lib/storage/templates.ts`)
3. ✅ Create API routes:
   - `GET /api/templates` - List all
   - `POST /api/templates` - Create new
   - `GET /api/templates/[id]` - Get one
   - `PUT /api/templates/[id]` - Update
   - `DELETE /api/templates/[id]` - Delete
4. ✅ Build TemplateCard component

### Phase 4: Email Editor Integration (Day 3-5)
1. ✅ Integrate GrapeJS atau react-email
2. ✅ Create EmailEditor component wrapper
3. ✅ Setup component library (buttons, text, images)
4. ✅ Configure GrapeJS for email-safe HTML
5. ✅ Add drag & drop functionality

### Phase 5: Preview System (Day 5-6)
1. ✅ Create live preview component
2. ✅ Implement desktop/mobile toggle
3. ✅ Add iframe preview with proper isolation
4. ✅ Real-time update on editor changes

### Phase 6: Variable System (Day 6-7)
1. ✅ Create merge tag parser (`lib/utils/mergeVars.ts`)
2. ✅ Add variable picker UI
3. ✅ Implement variable replacement
4. ✅ Show available variables in editor

### Phase 7: Export & Compilation (Day 7-8)
1. ✅ Setup MJML compiler (`lib/email/compiler.ts`)
2. ✅ Integrate juice for CSS inlining
3. ✅ Create export API endpoint
4. ✅ Add download HTML functionality
5. ✅ Validate email HTML compatibility

### Phase 8: Polish & Testing (Day 8-10)
1. ✅ Add loading states
2. ✅ Error handling with toast notifications
3. ✅ Add default template library
4. ✅ Testing on different email clients
5. ✅ Responsive design polish

---

## 💡 Key Features Detail

### 1. Email-Safe HTML Components
```typescript
// Contoh komponen yang perlu disediakan
- Layout Container (table-based)
- Text Block
- Heading (H1-H6)
- Image (with fallback)
- Button (VML for Outlook)
- Divider
- Spacer
- Social Icons
- Multi-column layout
```

### 2. Merge Variables
```typescript
// Format: {{variable_name}}
const variables = {
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Inc',
  unsubscribe_link: 'https://...'
};

// Usage in template
"Hello {{name}}, welcome to {{company}}!"
```

### 3. Export Options
- Raw HTML
- HTML with inlined CSS
- MJML source
- Plain text version

---

## 🔧 Configuration Examples

### GrapeJS Config
```typescript
const editorConfig = {
  container: '#gjs',
  fromElement: true,
  height: '100vh',
  storageManager: false,
  plugins: ['gjs-preset-newsletter'],
  pluginsOpts: {
    'gjs-preset-newsletter': {
      modalTitleImport: 'Import template',
      // ... more options
    }
  }
};
```

### MJML Compilation
```typescript
import mjml2html from 'mjml';
import juice from 'juice';

function compileEmail(mjmlCode: string) {
  // 1. Convert MJML to HTML
  const { html } = mjml2html(mjmlCode);

  // 2. Inline CSS
  const inlinedHtml = juice(html);

  return inlinedHtml;
}
```

---

## 📊 Database Schema (Optional)

```prisma
model Template {
  id          String   @id @default(cuid())
  name        String
  description String?
  subject     String
  html        String   @db.Text
  compiledHtml String? @db.Text
  thumbnail   String?
  variables   String[] // Array of variable names
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## ✅ MVP Checklist

**Must Have (Week 1-2)**
- [ ] Template CRUD operations
- [ ] Visual email editor (drag & drop)
- [ ] Live preview (desktop/mobile)
- [ ] Basic components (text, image, button)
- [ ] Export to HTML with inlined CSS
- [ ] Variable/merge tags support

**Nice to Have (Future)**
- [ ] Template categories/tags
- [ ] Duplicate template
- [ ] Version history
- [ ] Send test email
- [ ] Template marketplace
- [ ] Collaboration features
- [ ] Analytics integration

---

## 🎯 Success Metrics

1. **User dapat membuat email template dalam < 5 menit**
2. **Template kompatibel dengan major email clients** (Gmail, Outlook, Apple Mail)
3. **Export HTML < 100KB** (optimal untuk email)
4. **Mobile responsive** by default

---

## 📚 Additional Resources

### Email Client Compatibility
- [Can I Email](https://www.caniemail.com/) - CSS support in email clients
- [Email on Acid](https://www.emailonacid.com/) - Testing tool
- [Litmus](https://www.litmus.com/) - Email testing platform

### Best Practices
- Use table-based layouts for maximum compatibility
- Inline all CSS styles
- Keep email width at 600px max
- Use web-safe fonts with fallbacks
- Always provide alt text for images
- Test on multiple email clients

### Email Marketing Guidelines
- Include unsubscribe link
- Add physical mailing address
- Optimize for mobile (40%+ opens on mobile)
- Keep subject line under 50 characters
- Use preheader text effectively
- A/B test different versions

---

## 🤝 Contributing

This is a blueprint document. Update this file as the project evolves and new requirements emerge.

---

**Last Updated:** 2025-10-27
**Version:** 1.0.0
