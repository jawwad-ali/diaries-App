import dayjs from 'dayjs';
import { Diary } from '../../../interfaces/diary.interface';
import { Entry } from '../../../interfaces/entry.interface';
import { User } from '../../../interfaces/user.interface';
import { handleErrors } from '../server';
import { Response, Request } from 'miragejs';

// CREATE DIARY
export const create = (schema: any, req: Request): { user: User; diary: Diary } | Response => {

    try {
        const { title, type, userId } = JSON.parse(req.requestBody) as Partial<Diary>;

        const exUser = schema.users.findBy({ id: userId });
        if (!exUser) {
            return handleErrors(null, 'No such user exists.');
        }

        const now = dayjs().format();
        const diary = exUser.createDiary({
            title,
            type,
            createdAt: now,
            updatedAt: now,
        });

        return {
            user: {
                ...exUser.attrs,
            },
            diary: diary.attrs,
        };
    }
    catch (error) {
        return handleErrors(error, 'Failed to create Diary.');
    }
};

// UPDATE DIARY
export const updateDiary = (schema: any, req: Request): Diary | Response => {
    try {
        const diary = schema.diaries.find(req.params.id);
        const data = JSON.parse(req.requestBody) as Partial<Diary>;
        const now = dayjs().format();

        diary.update({
            ...data,
            updatedAt: now,
        });
        return diary.attrs as Diary;
    } catch (error) {
        return handleErrors(error, 'Failed to update Diary.');
    }
};

// FETCH DIARY
export const getDiaries = (schema: any, req: Request): Diary[] | Response => {
    try {
        const user = schema.users.find(req.params.id);
        return user.diary as Diary[];
    }
    catch (error) {
        return handleErrors(error, 'Could not get user diaries.');
    }
}

// SAVE ENTRY
export const addEntry = (schema: any, req: Request): { diary: Diary; entry: Entry } | Response => {
    try {

        const diary = schema.diaries.find(req.params.id)
        const { title, content } = JSON.parse(req.requestBody) as Partial<Entry>

        const now = dayjs().format();

        const entry = diary.createEntry({
            title,
            content,
            createdAt: now,
            updatedAt: now,
        });
        diary.update({
            ...diary.attrs,
            updatedAt: now,
        });

        return {
            diary: diary.attrs,
            entry: entry.attrs,
        };
    }
    catch (error) {
        return handleErrors(error, "Failed to save diary")
    }
}

// GET ENTRIES
export const getEntries = (schema: any, req: Request): { entries: Entry[] } | Response => {
    try {
        const diary = schema.diaries.find(req.params.id);
        return diary.entry;
    }
    catch (error) {
        return handleErrors(error, "Failed to get Diary entry")
    }
}

export const updateEntry = (schema: any, req: Request): Entry | Response => {
    try {
        const entry = schema.entries.find(req.params.id);

        const data = JSON.parse(req.requestBody) as Partial<Entry>;
        const now = dayjs().format();

        entry.update({
            ...data,
            updatedAt: now,
        });
        return entry.attrs as Entry;

    } catch (error) {
        return handleErrors(error, 'Failed to update entry.');
    }
};