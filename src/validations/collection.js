import { body } from "express-validator";


export const collectionValidation = [
    body('title','type title').isLength({min:1}).isString(),
    body('description','type text').isLength({min:1}).isString(),
    body('theme','wrong format').isLength({min:1}).isString(),
    body('custom3FieldOfInteger','boolean').optional().isBoolean(),
    body('custom3FieldOfText','boolean').optional().isBoolean(),
    body('custom3FieldOfLargeText','boolean').optional().isBoolean(),
    body('custom3FieldOfText','boolean').optional().isBoolean(),
    body('custom3FieldOfCheckBox','boolean').optional().isBoolean(),
    body('custom3FieldOfData','boolean').optional().isBoolean(),
];
