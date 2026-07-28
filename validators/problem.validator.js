import { body } from "express-validator";

export const createProblemValidator = [

    body("title")
    .notEmpty()
    .withMessage("Title required"),

    body("description")
    .notEmpty()
    .withMessage("Description required"),

    body("difficulty")
    .isIn(["Easy","Medium","Hard"])
    .withMessage("Invalid difficulty")

];