import {db} from '../db/client';
import {stories} from '../db/schema/stories';
import {eq} from 'drizzle-orm';

export const storiesRepository = {
    async findAll(limit: number, offset: number){
        return db.select().from(stories).where(eq(stories.isPublished, true)).limit(limit).offset(offset);
    },
    async findById(id: string){
        const result = await db.select().from(stories).where(eq(stories.id, id));
        return result[0] ?? null;
    }
}

