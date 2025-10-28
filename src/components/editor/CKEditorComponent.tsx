'use client';

import { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import 'ckeditor5/ckeditor5.css';

interface CKEditorComponentProps {
  initialHtml?: string;
  onChange?: (html: string) => void;
  height?: string;
}

export interface CKEditorComponentRef {
  getHtml: () => string;
  setHtml: (html: string) => void;
}

export const CKEditorComponent = forwardRef<CKEditorComponentRef, CKEditorComponentProps>(({
  initialHtml = '',
  onChange,
  height = 'calc(100vh - 80px)',
}, ref) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const onChangeRef = useRef(onChange);
  const { resolvedTheme } = useTheme();

  // Update ref when onChange changes
  onChangeRef.current = onChange;

  useEffect(() => {
    setIsLayoutReady(true);

    return () => {
      setIsLayoutReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isLayoutReady || !editorContainerRef.current) {
      return;
    }

    // Dynamic import to avoid SSR issues
    const initEditor = async () => {
      try {
        const {
          ClassicEditor,
          Essentials,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Font,
          Paragraph,
          Heading,
          Link,
          List,
          Table,
          TableToolbar,
          TableProperties,
          TableCellProperties,
          Image,
          ImageToolbar,
          ImageUpload,
          ImageResize,
          ImageStyle,
          Base64UploadAdapter,
          Alignment,
          Indent,
          IndentBlock,
          BlockQuote,
          MediaEmbed,
          HorizontalLine,
          SpecialCharacters,
          SpecialCharactersEssentials,
          RemoveFormat,
          SourceEditing,
          GeneralHtmlSupport,
        } = await import('ckeditor5');

        const { default: translations } = await import('ckeditor5/translations/en.js');

        if (!editorContainerRef.current) {
          return;
        }

        // Create editor
        const licenseKey = process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY || 'GPL';

        const editor = await ClassicEditor.create(editorContainerRef.current, {
          licenseKey: licenseKey,
          plugins: [
            Essentials,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Font,
            Paragraph,
            Heading,
            Link,
            List,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            Image,
            ImageToolbar,
            ImageUpload,
            ImageResize,
            ImageStyle,
            Base64UploadAdapter,
            Alignment,
            Indent,
            IndentBlock,
            BlockQuote,
            MediaEmbed,
            HorizontalLine,
            SpecialCharacters,
            SpecialCharactersEssentials,
            RemoveFormat,
            SourceEditing,
            GeneralHtmlSupport,
          ],
          toolbar: {
            items: [
              'undo', 'redo',
              '|',
              'sourceEditing',
              '|',
              'heading',
              '|',
              'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
              '|',
              'bold', 'italic', 'underline', 'strikethrough',
              '|',
              'alignment',
              '|',
              'numberedList', 'bulletedList',
              '|',
              'outdent', 'indent',
              '|',
              'link', 'insertImage', 'insertTable', 'mediaEmbed',
              '|',
              'blockQuote', 'horizontalLine', 'specialCharacters',
              '|',
              'removeFormat',
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            ],
          },
          fontSize: {
            options: [
              { title: '10px', model: '10px' },
              { title: '12px', model: '12px' },
              { title: '14px', model: '14px' },
              { title: '16px', model: '16px' },
              { title: '18px', model: '18px' },
              { title: '20px', model: '20px' },
              { title: '24px', model: '24px' },
              { title: '28px', model: '28px' },
              { title: '32px', model: '32px' },
              { title: '36px', model: '36px' },
              { title: '48px', model: '48px' },
            ],
            supportAllValues: true,
          },
          fontFamily: {
            options: [
              'default',
              'Arial, Helvetica, sans-serif',
              'Courier New, Courier, monospace',
              'Georgia, serif',
              'Lucida Sans Unicode, Lucida Grande, sans-serif',
              'Tahoma, Geneva, sans-serif',
              'Times New Roman, Times, serif',
              'Trebuchet MS, Helvetica, sans-serif',
              'Verdana, Geneva, sans-serif',
            ],
            supportAllValues: true,
          },
          fontColor: {
            columns: 6,
            colors: [
              { color: '#000000', label: 'Black' },
              { color: '#4D4D4D', label: 'Dark Grey' },
              { color: '#999999', label: 'Grey' },
              { color: '#FFFFFF', label: 'White', hasBorder: true },
              { color: '#F44E3B', label: 'Red' },
              { color: '#FE9200', label: 'Orange' },
              { color: '#FCDC00', label: 'Yellow' },
              { color: '#DBDF00', label: 'Yellow Green' },
              { color: '#A4DD00', label: 'Green' },
              { color: '#68CCCA', label: 'Cyan' },
              { color: '#73D8FF', label: 'Light Blue' },
              { color: '#AEA1FF', label: 'Purple' },
              { color: '#FDA1FF', label: 'Pink' },
            ],
          },
          fontBackgroundColor: {
            columns: 6,
            colors: [
              { color: '#FFFFFF', label: 'White', hasBorder: true },
              { color: '#F3F3F3', label: 'Light Grey' },
              { color: '#CCCCCC', label: 'Grey' },
              { color: '#000000', label: 'Black' },
              { color: '#FFE5E5', label: 'Light Red' },
              { color: '#FFE5CC', label: 'Light Orange' },
              { color: '#FFFFCC', label: 'Light Yellow' },
              { color: '#E5FFE5', label: 'Light Green' },
              { color: '#E5FFFF', label: 'Light Cyan' },
              { color: '#E5E5FF', label: 'Light Blue' },
              { color: '#F3E5FF', label: 'Light Purple' },
              { color: '#FFE5F3', label: 'Light Pink' },
            ],
          },
          table: {
            contentToolbar: [
              'tableColumn', 'tableRow', 'mergeTableCells',
              'tableProperties', 'tableCellProperties',
            ],
            defaultHeadings: { rows: 1, columns: 1 },
            tableProperties: {
              borderColors: [
                { color: '#000000', label: 'Black' },
                { color: '#CCCCCC', label: 'Grey' },
                { color: '#FFFFFF', label: 'White', hasBorder: true },
              ],
              backgroundColors: [
                { color: '#FFFFFF', label: 'White', hasBorder: true },
                { color: '#F3F3F3', label: 'Light Grey' },
                { color: '#3B82F6', label: 'Blue' },
              ],
            },
            tableCellProperties: {
              borderColors: [
                { color: '#000000', label: 'Black' },
                { color: '#CCCCCC', label: 'Grey' },
                { color: '#FFFFFF', label: 'White', hasBorder: true },
              ],
              backgroundColors: [
                { color: '#FFFFFF', label: 'White', hasBorder: true },
                { color: '#F3F3F3', label: 'Light Grey' },
                { color: '#3B82F6', label: 'Blue' },
              ],
            },
          },
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative',
              '|',
              'linkImage',
            ],
            upload: {
              types: ['jpeg', 'png', 'gif', 'webp'],
            },
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
              toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                  download: 'file',
                },
              },
            },
          },
          htmlSupport: {
            allow: [
              {
                name: /^(div|section|article|table|tbody|thead|tr|td|th|span|a|img|p|h1|h2|h3|h4|h5|h6|ul|ol|li|br|hr)$/,
                attributes: true,
                classes: true,
                styles: true,
              },
            ],
          },
          language: 'en',
          translations: [translations],
          initialData: initialHtml,
        });

        editorRef.current = editor;

        // Listen to changes
        editor.model.document.on('change:data', () => {
          const data = editor.getData();
          if (onChangeRef.current) {
            onChangeRef.current(data);
          }
        });
      } catch (error) {
        console.error('CKEditor initialization error:', error);
      }
    };

    initEditor();

    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy().catch((error: any) => {
          console.error('Error destroying CKEditor:', error);
        });
        editorRef.current = null;
      }
    };
  }, [isLayoutReady]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getHtml: () => {
      if (editorRef.current) {
        return editorRef.current.getData();
      }
      return '';
    },
    setHtml: (html: string) => {
      if (editorRef.current) {
        editorRef.current.setData(html);
      }
    },
  }));

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className={`ckeditor-wrapper transition-colors ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      style={{ height }}
    >
      <style jsx global>{`
        .ckeditor-wrapper .ck-editor {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .ckeditor-wrapper .ck-editor__main {
          flex: 1;
          overflow: hidden;
        }

        .ckeditor-wrapper .ck-content {
          height: 100%;
          overflow-y: auto;
          padding: 20px;
          background: ${isDark ? '#1f2937' : '#ffffff'};
          color: ${isDark ? '#f3f4f6' : '#000000'};
        }

        .ckeditor-wrapper .ck.ck-toolbar {
          background: ${isDark ? '#374151' : '#ffffff'};
          border-bottom: 1px solid ${isDark ? '#4b5563' : '#e5e7eb'};
          padding: 8px;
          flex-wrap: wrap;
        }

        .ckeditor-wrapper .ck.ck-button {
          padding: 6px;
          color: ${isDark ? '#f3f4f6' : '#000000'};
        }

        .ckeditor-wrapper .ck.ck-button:not(.ck-disabled):hover {
          background: ${isDark ? '#4b5563' : '#f3f4f6'};
        }

        .ckeditor-wrapper .ck.ck-button.ck-on {
          background: ${isDark ? '#3b82f6' : '#dbeafe'};
          color: ${isDark ? '#ffffff' : '#1e40af'};
        }

        .ckeditor-wrapper .ck.ck-dropdown__panel {
          background: ${isDark ? '#374151' : '#ffffff'};
          border: 1px solid ${isDark ? '#4b5563' : '#e5e7eb'};
        }

        .ckeditor-wrapper .ck.ck-list__item {
          color: ${isDark ? '#f3f4f6' : '#000000'};
        }

        .ckeditor-wrapper .ck.ck-list__item:hover {
          background: ${isDark ? '#4b5563' : '#f3f4f6'};
        }

        .ckeditor-wrapper .ck.ck-editor__editable {
          background: ${isDark ? '#1f2937' : '#ffffff'};
          color: ${isDark ? '#f3f4f6' : '#000000'};
          border-color: ${isDark ? '#4b5563' : '#e5e7eb'};
        }

        .ckeditor-wrapper .ck.ck-editor__editable:focus {
          border-color: ${isDark ? '#3b82f6' : '#3b82f6'};
        }

        .ckeditor-wrapper .ck.ck-input,
        .ckeditor-wrapper .ck.ck-input-text {
          background: ${isDark ? '#1f2937' : '#ffffff'};
          color: ${isDark ? '#f3f4f6' : '#000000'};
          border-color: ${isDark ? '#4b5563' : '#e5e7eb'};
        }

        .ckeditor-wrapper .ck.ck-labeled-field-view__status {
          color: ${isDark ? '#9ca3af' : '#6b7280'};
        }

        .ckeditor-wrapper .ck.ck-balloon-panel {
          background: ${isDark ? '#374151' : '#ffffff'};
          border: 1px solid ${isDark ? '#4b5563' : '#e5e7eb'};
        }

        .ckeditor-wrapper .ck.ck-tooltip__text {
          background: ${isDark ? '#1f2937' : '#374151'};
          color: ${isDark ? '#f3f4f6' : '#ffffff'};
        }

        .ckeditor-wrapper .ck.ck-splitbutton__arrow {
          color: ${isDark ? '#f3f4f6' : '#000000'};
        }

        /* Email-friendly content styles */
        .ckeditor-wrapper .ck-content table {
          max-width: 600px;
          margin: 0 auto;
          border-collapse: collapse;
        }

        .ckeditor-wrapper .ck-content img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
      <div ref={editorContainerRef} />
    </div>
  );
});

CKEditorComponent.displayName = 'CKEditorComponent';
