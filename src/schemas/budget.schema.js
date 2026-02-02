import z from "zod";

export const formSchema = z.object({
  budgetType: z.string(),
  period: z.string(),
  budgetFormat: z.string(),
})

export const excelBudgetRowSchema = z.object({

  budgets: z.array(z.number()).length(12),

  category: z
    .string()
    .min(1, "Category is required"),

  item: z
    .string()
    .min(1, "Item is required"),
});