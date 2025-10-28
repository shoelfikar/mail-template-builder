'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EmailEditor, EditorToolbar } from '@/components/editor';
import { CKEditorComponent } from '@/components/editor/CKEditorComponent';
import type { EditorMode } from '@/components/editor/EditorToolbar';
import { useEditorStore } from '@/stores/editorStore';
import type { EmailTemplate } from '@/types/template';
import toast from 'react-hot-toast';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');

  const visualEditorRef = useRef<any>(null);
  const codeEditorRef = useRef<any>(null);
  const { setCurrentTemplate, isDirty, setDirty } = useEditorStore();

  const [editorMode, setEditorMode] = useState<EditorMode>('visual');
  const [templateName, setTemplateName] = useState('Untitled Template');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [templateTags, setTemplateTags] = useState<string[]>([]);
  const [templateHtml, setTemplateHtml] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load template if editing existing one
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    } else {
      // New template
      setTemplateName('Untitled Template');
      setTemplateSubject('');
      setTemplateDescription('');
      setTemplateCategory('');
      setTemplateTags([]);
      setTemplateHtml('');
    }
  }, [templateId]);

  const loadTemplate = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/templates/${id}`);
      const result = await response.json();

      if (result.success) {
        const template: EmailTemplate = result.data;
        setCurrentTemplate(template);
        setTemplateName(template.name);
        setTemplateSubject(template.subject);
        setTemplateDescription(template.description || '');
        setTemplateCategory(template.category || '');
        setTemplateTags(template.tags || []);
        setTemplateHtml(template.html);
        setDirty(false);
      } else {
        toast.error('Failed to load template');
        router.push('/templates');
      }
    } catch (error) {
      toast.error('Error loading template');
      console.error(error);
      router.push('/templates');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editor mode change
  const handleEditorModeChange = (mode: EditorMode) => {
    // Sync content between editors before switching
    if (mode === 'code') {
      // Switching to code mode: get HTML from visual editor
      const html = visualEditorRef.current?.getHtml() || templateHtml;
      setTemplateHtml(html);
      // Update code editor after state is set
      setTimeout(() => {
        codeEditorRef.current?.setHtml(html);
      }, 100);
    } else {
      // Switching to visual mode: get HTML from code editor
      const html = codeEditorRef.current?.getHtml() || templateHtml;
      setTemplateHtml(html);
    }
    setEditorMode(mode);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Get HTML from active editor
      let html = templateHtml;
      if (editorMode === 'visual') {
        html = visualEditorRef.current?.getHtml() || templateHtml;
      } else {
        html = codeEditorRef.current?.getHtml() || templateHtml;
      }

      const payload = {
        name: templateName,
        subject: templateSubject,
        description: templateDescription,
        category: templateCategory,
        tags: templateTags,
        html: html,
      };

      let response;
      if (templateId) {
        // Update existing template
        response = await fetch(`/api/templates/${templateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new template
        response = await fetch('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (result.success) {
        toast.success(templateId ? 'Template updated!' : 'Template created!');
        setDirty(false);

        // If new template, redirect to edit mode
        if (!templateId && result.data?.id) {
          router.push(`/editor?id=${result.data.id}`);
        }
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      toast.error('Error saving template');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    // Get HTML from active editor
    let html = templateHtml;
    let css = '';
    if (editorMode === 'visual') {
      html = visualEditorRef.current?.getHtml() || templateHtml;
      css = visualEditorRef.current?.getCss() || '';
    } else {
      html = codeEditorRef.current?.getHtml() || templateHtml;
    }

    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateSubject}</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>
    `.trim();

    // Download HTML file
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Template exported!');
  };

  const handlePreview = () => {
    // Get HTML from active editor
    let html = templateHtml;
    let css = '';
    if (editorMode === 'visual') {
      html = visualEditorRef.current?.getHtml() || templateHtml;
      css = visualEditorRef.current?.getCss() || '';
    } else {
      html = codeEditorRef.current?.getHtml() || templateHtml;
    }

    const previewHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateSubject}</title>
  <style>
    body { margin: 0; padding: 20px; background: #f5f5f5; }
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>
    `;

    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewHtml);
      previewWindow.document.close();
    } else {
      toast.error('Please allow popups to preview');
    }
  };

  const handleEditorChange = (html: string) => {
    setTemplateHtml(html);
    setDirty(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-blue-600 dark:text-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <EditorToolbar
        templateName={templateName}
        templateSubject={templateSubject}
        templateDescription={templateDescription}
        templateCategory={templateCategory}
        templateTags={templateTags}
        editorMode={editorMode}
        onTemplateNameChange={(name) => {
          setTemplateName(name);
          setDirty(true);
        }}
        onTemplateSubjectChange={(subject) => {
          setTemplateSubject(subject);
          setDirty(true);
        }}
        onTemplateDescriptionChange={(description) => {
          setTemplateDescription(description);
          setDirty(true);
        }}
        onTemplateCategoryChange={(category) => {
          setTemplateCategory(category);
          setDirty(true);
        }}
        onTemplateTagsChange={(tags) => {
          setTemplateTags(tags);
          setDirty(true);
        }}
        onEditorModeChange={handleEditorModeChange}
        onSave={handleSave}
        onExport={handleExport}
        onPreview={handlePreview}
        isSaving={isSaving}
        isDirty={isDirty}
      />

      <div className="flex-1 overflow-hidden">
        {editorMode === 'visual' ? (
          <EmailEditor
            ref={visualEditorRef}
            initialHtml={templateHtml}
            onChange={handleEditorChange}
            height="calc(100vh - 73px)"
          />
        ) : (
          <CKEditorComponent
            ref={codeEditorRef}
            initialHtml={templateHtml}
            onChange={handleEditorChange}
            height="calc(100vh - 73px)"
          />
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <EditorContent />
    </ProtectedRoute>
  );
}
