import { executeQuery } from './database.js';
import { ContentItem, Category } from '../types.js';

// Database interfaces matching our table structure
export interface DBContent {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url?: string;
  external_link?: string;
  deadline?: string;
  tag?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DBContentDetailImage {
  id: number;
  content_id: string;
  image_url: string;
  sort_order: number;
}

export interface DBContentDetailedSection {
  id: number;
  content_id: string;
  type: string;
  subtitle?: string;
  body?: string;
  icon_class?: string;
  sort_order: number;
}

export interface DBSectionProgressData {
  id: number;
  section_id: number;
  current_value: number;
  target_value: number;
  label?: string;
}

export interface DBSectionExtraData {
  id: number;
  section_id: number;
  data_text: string;
  sort_order: number;
}

export interface DBSectionFaqData {
  id: number;
  section_id: number;
  question: string;
  answer: string;
  sort_order: number;
}

// Model functions
export class ContentModel {
  // Get all regions
  static async getRegions(): Promise<string[]> {
    const rows = await executeQuery<{name: string}>('SELECT name FROM regions ORDER BY id');
    return rows.map(row => row.name);
  }

  // Get all MBTI types
  static async getMbtiTypes(): Promise<string[]> {
    const rows = await executeQuery<{type: string}>('SELECT type FROM mbti_types ORDER BY id');
    return rows.map(row => row.type);
  }

  // Get all contents
  static async getAllContents(): Promise<ContentItem[]> {
    const contents = await executeQuery<DBContent>(`
      SELECT id, title, category, description, image_url, external_link, deadline, tag, created_at, updated_at
      FROM contents
      ORDER BY created_at DESC
    `);

    const contentItems: ContentItem[] = [];

    for (const content of contents) {
      const item = await this.buildContentItem(content);
      contentItems.push(item);
    }

    return contentItems;
  }

  // Get content by ID
  static async getContentById(id: string): Promise<ContentItem | null> {
    const contents = await executeQuery<DBContent>(`
      SELECT id, title, category, description, image_url, external_link, deadline, tag, created_at, updated_at
      FROM contents
      WHERE id = ?
    `, [id]);

    if (contents.length === 0) {
      return null;
    }

    return await this.buildContentItem(contents[0]);
  }

  // Get contents by category
  static async getContentsByCategory(category: Category): Promise<ContentItem[]> {
    const contents = await executeQuery<DBContent>(`
      SELECT id, title, category, description, image_url, external_link, deadline, tag, created_at, updated_at
      FROM contents
      WHERE category = ?
      ORDER BY created_at DESC
    `, [category]);

    const contentItems: ContentItem[] = [];

    for (const content of contents) {
      const item = await this.buildContentItem(content);
      contentItems.push(item);
    }

    return contentItems;
  }

  // Helper method to build a complete ContentItem from database data
  private static async buildContentItem(dbContent: DBContent): Promise<ContentItem> {
    // Get detail images
    const detailImages = await executeQuery<DBContentDetailImage>(`
      SELECT image_url
      FROM content_detail_images
      WHERE content_id = ?
      ORDER BY sort_order
    `, [dbContent.id]);

    // Get detailed sections
    const sections = await executeQuery<DBContentDetailedSection>(`
      SELECT id, type, subtitle, body, icon_class, sort_order
      FROM content_detailed_sections
      WHERE content_id = ?
      ORDER BY sort_order
    `, [dbContent.id]);

    const detailedSections = [];

    for (const section of sections) {
      const sectionData: any = {
        type: section.type as any,
        subtitle: section.subtitle,
        body: section.body,
        iconClass: section.icon_class
      };

      // Get progress data if type is 'progress'
      if (section.type === 'progress') {
        const progressData = await executeQuery<DBSectionProgressData>(`
          SELECT current_value, target_value, label
          FROM section_progress_data
          WHERE section_id = ?
        `, [section.id]);

        if (progressData.length > 0) {
          sectionData.progressData = {
            current: progressData[0].current_value,
            target: progressData[0].target_value,
            label: progressData[0].label
          };
        }
      }

      // Get extra data if type is 'checklist', 'steps', or 'highlight'
      if (section.type === 'checklist' || section.type === 'steps' || section.type === 'highlight') {
        const extraData = await executeQuery<DBSectionExtraData>(`
          SELECT data_text
          FROM section_extra_data
          WHERE section_id = ?
          ORDER BY sort_order
        `, [section.id]);

        sectionData.extraData = extraData.map(item => item.data_text);
      }

      // Get FAQ data if type is 'faq'
      if (section.type === 'faq') {
        const faqData = await executeQuery<DBSectionFaqData>(`
          SELECT question, answer
          FROM section_faq_data
          WHERE section_id = ?
          ORDER BY sort_order
        `, [section.id]);

        sectionData.faqData = faqData.map(item => ({
          question: item.question,
          answer: item.answer
        }));
      }

      detailedSections.push(sectionData);
    }

    return {
      id: dbContent.id,
      title: dbContent.title,
      category: dbContent.category as Category,
      description: dbContent.description,
      imageUrl: dbContent.image_url || '',
      detailImages: detailImages.map(img => img.image_url),
      externalLink: dbContent.external_link,
      deadline: dbContent.deadline,
      tag: dbContent.tag,
      detailedSections: detailedSections.length > 0 ? detailedSections : undefined
    };
  }
}
export class TypeTestModel {
  static async saveSubmission(data: {
    name: string;
    phone: string;
    region: string;
    status?: string;
    worry?: string;
    result?: string;
  }): Promise<void> {
    await executeQuery(
      'INSERT INTO type_test_submissions (name, phone, region, status, worry, result) VALUES (?, ?, ?, ?, ?, ?)',
      [data.name, data.phone, data.region, data.status || null, data.worry || null, data.result || null]
    );
  }
}
