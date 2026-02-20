// Email template variables for invoice emails
export const EMAIL_TEMPLATE_VARIABLES = [
  {
    variable: 'fullName',
    label: 'Customer Full Name',
    description: 'The full name of the customer',
    example: 'Dr. John Doe',
  },
  {
    variable: 'firstName',
    label: 'Customer First Name',
    description: 'The first name of the customer',
    example: 'John',
  },
  {
    variable: 'lastName',
    label: 'Customer Last Name',
    description: 'The last name of the customer',
    example: 'Doe',
  },
  {
    variable: 'email',
    label: 'Customer Email',
    description: 'The email address of the customer',
    example: 'john.doe@example.com',
  },
  {
    variable: 'invoiceNumber',
    label: 'Invoice Number',
    description: 'The unique invoice number',
    example: 'INV-2025-11-25-0021',
  },
  {
    variable: 'invoiceDate',
    label: 'Invoice Date',
    description: 'The date the invoice was created',
    example: 'November 22, 2025',
  },
  {
    variable: 'dueDate',
    label: 'Due Date',
    description: 'The payment due date',
    example: 'December 22, 2025',
  },
  {
    variable: 'invoiceAmount',
    label: 'Invoice Amount',
    description: 'The total amount of the invoice',
    example: '$1,234.56',
  },
  {
    variable: 'currency',
    label: 'Currency',
    description: 'The currency code',
    example: 'USD',
  },
  {
    variable: 'companyName',
    label: 'Company Name',
    description: "The customer's company name",
    example: 'Acme Corporation',
  },
  {
    variable: 'accountNumber',
    label: 'Account Number',
    description: 'Bank account number for payment',
    example: '1234567890',
  },
  {
    variable: 'bankName',
    label: 'Bank Name',
    description: 'Name of the bank',
    example: 'First National Bank',
  },
  {
    variable: 'invoiceLink',
    label: 'Invoice Link',
    description: 'Direct link to view the invoice PDF',
    example: 'https://res.cloudinary.com/invoice.pdf',
  },
];

// Helper function to insert variable into text at cursor position
export const insertVariableAtCursor = (
  currentText,
  variable,
  cursorPosition
) => {
  const variableTag = `{{${variable}}}`;
  const before = currentText.slice(0, cursorPosition);
  const after = currentText.slice(cursorPosition);
  return before + variableTag + after;
};

// Helper function to format variable for display
export const formatVariable = (variable) => `{{${variable}}}`;

// Helper function to extract variables from text
export const extractVariables = (text) => {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

// Helper function to validate if a variable exists
export const isValidVariable = (variable) => {
  return EMAIL_TEMPLATE_VARIABLES.some((v) => v.variable === variable);
};
