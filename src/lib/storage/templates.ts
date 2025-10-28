import { promises as fs } from 'fs';
import path from 'path';
import type { EmailTemplate, CreateTemplateInput, UpdateTemplateInput } from '@/types/template';

const TEMPLATES_DIR = path.join(process.cwd(), 'data', 'templates');
const TEMPLATES_FILE = path.join(TEMPLATES_DIR, 'templates.json');

// Ensure templates directory exists
async function ensureTemplatesDir() {
  try {
    await fs.access(TEMPLATES_DIR);
  } catch {
    await fs.mkdir(TEMPLATES_DIR, { recursive: true });
  }
}

// Ensure templates file exists
async function ensureTemplatesFile() {
  await ensureTemplatesDir();
  try {
    await fs.access(TEMPLATES_FILE);
  } catch {
    await fs.writeFile(TEMPLATES_FILE, JSON.stringify([], null, 2));
  }
}

// Read all templates
export async function getAllTemplates(): Promise<EmailTemplate[]> {
  await ensureTemplatesFile();
  const data = await fs.readFile(TEMPLATES_FILE, 'utf-8');
  return JSON.parse(data);
}

// Get template by ID
export async function getTemplateById(id: string): Promise<EmailTemplate | null> {
  const templates = await getAllTemplates();
  return templates.find((t) => t.id === id) || null;
}

// Create new template
export async function createTemplate(input: CreateTemplateInput, userId: string): Promise<EmailTemplate> {
  const templates = await getAllTemplates();

  const newTemplate: EmailTemplate = {
    id: generateId(),
    name: input.name,
    description: input.description,
    subject: input.subject,
    html: input.html || '',
    compiledHtml: undefined,
    thumbnail: undefined,
    variables: [],
    category: input.category,
    tags: input.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  templates.push(newTemplate);
  await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2));

  return newTemplate;
}

// Update template
export async function updateTemplate(
  id: string,
  input: UpdateTemplateInput
): Promise<EmailTemplate | null> {
  const templates = await getAllTemplates();
  const index = templates.findIndex((t) => t.id === id);

  if (index === -1) {
    return null;
  }

  const updated: EmailTemplate = {
    ...templates[index],
    ...input,
    updatedAt: new Date(),
  };

  templates[index] = updated;
  await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2));

  return updated;
}

// Delete template
export async function deleteTemplate(id: string): Promise<boolean> {
  const templates = await getAllTemplates();
  const filtered = templates.filter((t) => t.id !== id);

  if (filtered.length === templates.length) {
    return false; // Template not found
  }

  await fs.writeFile(TEMPLATES_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// Generate unique ID
function generateId(): string {
  return `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get templates by user (for multi-user support in future)
export async function getTemplatesByUser(userId: string): Promise<EmailTemplate[]> {
  // For now, return all templates
  // In future, filter by userId
  return getAllTemplates();
}

// Search templates
export async function searchTemplates(query: string): Promise<EmailTemplate[]> {
  const templates = await getAllTemplates();
  const lowerQuery = query.toLowerCase();

  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description?.toLowerCase().includes(lowerQuery) ||
      t.subject.toLowerCase().includes(lowerQuery) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// Get templates by category
export async function getTemplatesByCategory(category: string): Promise<EmailTemplate[]> {
  const templates = await getAllTemplates();
  return templates.filter((t) => t.category === category);
}
