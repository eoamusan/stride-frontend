import z from "zod";

export const formSchema = z.object({
  budgetType: z.string(),
  period: z.string(),
  budgetFormat: z.string(),
})

export const excelBudgetRowSchema = z.object({
  Actual: z
    .number({ invalid_type_error: "Actual must be a number" })
    .nonnegative("Actual must be ≥ 0"),

  Budget: z
    .number({ invalid_type_error: "Budget must be a number" })
    .nonnegative("Budget must be ≥ 0"),

  Category: z
    .string()
    .min(1, "Category is required"),

  Item: z
    .string()
    .min(1, "Item is required"),
});