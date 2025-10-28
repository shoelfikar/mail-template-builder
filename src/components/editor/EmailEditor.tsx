'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-newsletter';

interface EmailEditorProps {
  initialHtml?: string;
  onChange?: (html: string) => void;
  height?: string;
}

export interface EmailEditorRef {
  getHtml: () => string;
  getCss: () => string;
}

export const EmailEditor = forwardRef<EmailEditorRef, EmailEditorProps>(({
  initialHtml = '',
  onChange,
  height = '100vh',
}, ref) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    // Initialize GrapeJS
    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height,
      width: 'auto',
      storageManager: false,

      // Plugins
      plugins: ['gjs-preset-newsletter'],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalTitleImport: 'Import Template',
          modalTitleExport: 'Export Template',
          modalLabelImport: 'Paste your HTML/CSS code here',
          modalLabelExport: 'Copy the code below',
          codeViewerTheme: 'hopscotch',
          importPlaceholder: '<table class="main-table">...</table>',
          cellStyle: {
            'font-size': '14px',
            'font-weight': 400,
            'vertical-align': 'top',
            color: 'rgb(51, 51, 51)',
            margin: 0,
            padding: 0,
          },
        },
      },

      // Canvas settings
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        ],
        scripts: [],
      },

      // Device Manager
      deviceManager: {
        devices: [
          {
            id: 'desktop',
            name: 'Desktop',
            width: '100%',
          },
          {
            id: 'tablet',
            name: 'Tablet',
            width: '768px',
            widthMedia: '768px',
          },
          {
            id: 'mobile',
            name: 'Mobile',
            width: '320px',
            widthMedia: '480px',
          },
        ],
      },

      // Panels
      panels: {
        defaults: [
          {
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true,
                className: 'btn-toggle-borders',
                label: '<i class="fa fa-clone"></i>',
                command: 'sw-visibility',
              },
            ],
          },
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                label: '<i class="fa fa-desktop"></i>',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
              },
              {
                id: 'device-tablet',
                label: '<i class="fa fa-tablet"></i>',
                command: 'set-device-tablet',
                togglable: false,
              },
              {
                id: 'device-mobile',
                label: '<i class="fa fa-mobile"></i>',
                command: 'set-device-mobile',
                togglable: false,
              },
            ],
          },
        ],
      },

      // Block Manager
      blockManager: {
        appendTo: '#blocks',
      },

      // Style Manager
      styleManager: {
        appendTo: '#styles-container',
        sectors: [
          {
            name: 'General',
            open: false,
            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
          },
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
          },
          {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
          },
          {
            name: 'Decorations',
            open: false,
            buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'background'],
          },
        ],
      },

      // Layer Manager
      layerManager: {
        appendTo: '#layers-container',
      },

      // Trait Manager
      traitManager: {
        appendTo: '#traits-container',
      },
    });

    // Commands for device switching
    editor.Commands.add('set-device-desktop', {
      run: (editor) => editor.setDevice('Desktop'),
    });
    editor.Commands.add('set-device-tablet', {
      run: (editor) => editor.setDevice('Tablet'),
    });
    editor.Commands.add('set-device-mobile', {
      run: (editor) => editor.setDevice('Mobile'),
    });

    // Add custom blocks for better workflow
    const blockManager = editor.BlockManager;

    // Add Header block
    blockManager.add('header-block', {
      label: 'Header',
      category: 'Basic',
      content: `
        <table style="width: 100%; background-color: #3b82f6; padding: 30px 20px;">
          <tr>
            <td style="text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Your Header Title
              </h1>
            </td>
          </tr>
        </table>
      `,
      attributes: { class: 'fa fa-header' },
    });

    // Add Text block
    blockManager.add('text-block', {
      label: 'Text',
      category: 'Basic',
      content: `
        <table style="width: 100%;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.6;">
                Click to edit this text. You can change the font, size, color, and more.
              </p>
            </td>
          </tr>
        </table>
      `,
      attributes: { class: 'fa fa-text-width' },
    });

    // Add Button block
    blockManager.add('button-block', {
      label: 'Button',
      category: 'Basic',
      content: `
        <table style="width: 100%;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <a href="#" style="display: inline-block; padding: 12px 30px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                Click Me
              </a>
            </td>
          </tr>
        </table>
      `,
      attributes: { class: 'fa fa-square' },
    });

    // Add Image block
    blockManager.add('image-block', {
      label: 'Image',
      category: 'Basic',
      content: `
        <table style="width: 100%;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <img src="https://via.placeholder.com/600x300" alt="Placeholder" style="max-width: 100%; height: auto; border-radius: 8px;" />
            </td>
          </tr>
        </table>
      `,
      attributes: { class: 'fa fa-image' },
    });

    // Add Divider block
    blockManager.add('divider-block', {
      label: 'Divider',
      category: 'Basic',
      content: `
        <table style="width: 100%;">
          <tr>
            <td style="padding: 20px;">
              <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 0;" />
            </td>
          </tr>
        </table>
      `,
      attributes: { class: 'fa fa-minus' },
    });

    // Add 2 Columns block
    blockManager.add('columns-2', {
      label: '2 Columns',
      category: 'Layout',
      content: `
        <table style="width: 100%;">
          <tr>
            <td style="padding: 20px; width: 50%; vertical-align: top;">
              <p style="margin: 0; color: #333;">Column 1 content</p>
            </td>
            <td style="padding: 20px; width: 50%; vertical-align: top;">
              <p style="margin: 0; color: #333;">Column 2 content</p>
            </td>
          </tr>
        </table>
      `,
      attributes: { class: 'fa fa-columns' },
    });

    // Add Footer block
    blockManager.add('footer-block', {
      label: 'Footer',
      category: 'Basic',
      content: `
        <table style="width: 100%; background-color: #f5f5f5; padding: 30px 20px;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                © 2024 Your Company. All rights reserved.
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                123 Street Name, City, State 12345
              </p>
            </td>
          </tr>
        </table>
      `,
      attributes: { class: 'fa fa-bars' },
    });

    // Add Merge Tags category with common variables
    blockManager.add('merge-name', {
      label: '{{name}}',
      category: 'Merge Tags',
      content: '<span>{{name}}</span>',
      attributes: { class: 'fa fa-user' },
    });

    blockManager.add('merge-email', {
      label: '{{email}}',
      category: 'Merge Tags',
      content: '<span>{{email}}</span>',
      attributes: { class: 'fa fa-envelope' },
    });

    blockManager.add('merge-company', {
      label: '{{company}}',
      category: 'Merge Tags',
      content: '<span>{{company}}</span>',
      attributes: { class: 'fa fa-building' },
    });

    blockManager.add('merge-phone', {
      label: '{{phone}}',
      category: 'Merge Tags',
      content: '<span>{{phone}}</span>',
      attributes: { class: 'fa fa-phone' },
    });

    blockManager.add('merge-date', {
      label: '{{date}}',
      category: 'Merge Tags',
      content: '<span>{{date}}</span>',
      attributes: { class: 'fa fa-calendar' },
    });

    // Load initial HTML or default template
    if (initialHtml) {
      editor.setComponents(initialHtml);
    } else {
      // Add default email structure for new templates
      const defaultTemplate = `
        <table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">
              <h1 style="margin: 0; color: #333;">Your Email Title</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <p style="margin: 0 0 15px 0; color: #666; line-height: 1.6;">
                Start writing your email content here. You can edit this text or drag new components from the left sidebar.
              </p>
              <p style="margin: 0; color: #666; line-height: 1.6;">
                Click on any element to edit it!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #f5f5f5; font-size: 12px; color: #999;">
              <p style="margin: 0;">© 2024 Your Company. All rights reserved.</p>
            </td>
          </tr>
        </table>
      `;
      editor.setComponents(defaultTemplate);
    }

    // On change event
    if (onChange) {
      editor.on('update', () => {
        const html = editor.getHtml();
        onChange(html);
      });
    }

    // Store editor instance
    editorRef.current = editor;

    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialHtml, onChange, height]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getHtml: () => {
      if (editorRef.current) {
        return editorRef.current.getHtml();
      }
      return '';
    },
    getCss: () => {
      if (editorRef.current) {
        return editorRef.current.getCss();
      }
      return '';
    },
  }));

  return (
    <div className="gjs-editor-wrapper">
      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        .gjs-editor-wrapper {
          height: ${height};
        }

        /* Custom GrapeJS styling */
        .gjs-cv-canvas {
          background-color: #f5f5f5;
        }

        .gjs-blocks-c {
          min-height: 100vh;
          display: flex;
          flex-wrap: wrap;
          padding: 10px;
        }

        /* Block styling */
        .gjs-block {
          width: calc(50% - 10px);
          min-height: 80px;
          margin: 5px;
          padding: 12px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .gjs-block:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
          transform: translateY(-2px);
        }

        .gjs-block__media {
          font-size: 24px;
          color: #3b82f6;
        }

        .gjs-block-label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          text-align: center;
        }

        .gjs-block-category {
          margin-bottom: 15px;
        }

        .gjs-block-category .gjs-title {
          padding: 10px;
          background-color: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.5px;
        }

        /* Panel styling */
        .panel__basic-actions {
          display: flex;
          gap: 5px;
          padding: 5px;
        }

        .panel__devices {
          display: flex;
          gap: 5px;
          padding: 5px;
        }

        .gjs-pn-btn {
          padding: 8px 12px;
          border-radius: 4px;
          background-color: #fff;
          border: 1px solid #ddd;
          cursor: pointer;
        }

        .gjs-pn-btn:hover {
          background-color: #f5f5f5;
        }

        .gjs-pn-btn.gjs-pn-active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        /* Style Manager improvements */
        .gjs-sm-sector {
          border-bottom: 1px solid #e5e7eb;
        }

        .gjs-sm-sector .gjs-sm-title {
          background-color: #f9fafb;
          padding: 10px;
          font-weight: 600;
          font-size: 13px;
          color: #374151;
        }

        .gjs-sm-properties {
          padding: 10px;
        }

        .gjs-sm-property {
          margin-bottom: 10px;
        }

        .gjs-sm-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 5px;
        }

        /* Layer Manager improvements */
        .gjs-layer {
          padding: 8px 10px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .gjs-layer:hover {
          background-color: #f9fafb;
        }

        .gjs-layer.gjs-selected {
          background-color: #eff6ff;
          border-left: 3px solid #3b82f6;
        }

        /* Trait Manager improvements */
        .gjs-trt-trait {
          padding: 10px;
          border-bottom: 1px solid #f3f4f6;
        }

        .gjs-trt-trait__wrp-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .gjs-field input,
        .gjs-field select {
          padding: 6px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 13px;
          width: 100%;
        }

        .gjs-field input:focus,
        .gjs-field select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
      <div ref={containerRef} id="gjs-editor" />
    </div>
  );
});

EmailEditor.displayName = 'EmailEditor';
