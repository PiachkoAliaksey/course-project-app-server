import { body } from "express-validator";


export const collectionValidation = [
    body('title', 'type title').isLength({ min: 1 }).isString(),
    body('description', 'type text').isLength({ min: 1 }).isString(),
    body('theme', 'wrong format').isLength({ min: 1 }).isString(),
    body('customFields', 'boolean').optional().isArray,
];
