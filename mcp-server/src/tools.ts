import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getStoryById, listCategories, searchStories } from './api-client';

export function registerTools(server: McpServer) {
  server.registerTool(
    'search_stories',
    {
      title: 'Search Stories',
      description:
        "Search for stories about Marrakesh's historical monuments. Returns short summaries — use get_story to fetch the full text of a specific one.",
      inputSchema: {
        search: z
          .string()
          .optional()
          .describe('Free-text search on the title and description (French or English)'),
        categoryId: z
          .string()
          .optional()
          .describe('Filter by category id, obtained from list_categories'),
      },
    },
    async ({ search, categoryId }) => {
      const stories = await searchStories({ search, categoryId });
      const summary = stories.map((s) => ({
        id: s.id,
        titleEn: s.titleEn,
        titleFr: s.titleFr,
        shortDescriptionEn: s.shortDescriptionEn,
        shortDescriptionFr: s.shortDescriptionFr,
        century: s.century,
      }));
      return {
        content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_story',
    {
      title: 'Get Story Details',
      description: 'Get the full details of one story, including its complete narrative text.',
      inputSchema: {
        id: z.string().describe('The story id, obtained from search_stories'),
      },
    },
    async ({ id }) => {
      const story = await getStoryById(id);
      if (!story) {
        return {
          content: [{ type: 'text', text: `No story found with id ${id}.` }],
          isError: true,
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(story, null, 2) }],
      };
    }
  );

  server.registerTool(
    'list_categories',
    {
      title: 'List Categories',
      description:
        'List all monument categories (e.g. religious monument, palace, garden), to help filter search_stories.',
      inputSchema: {},
    },
    async () => {
      const categories = await listCategories();
      return {
        content: [{ type: 'text', text: JSON.stringify(categories, null, 2) }],
      };
    }
  );
}
