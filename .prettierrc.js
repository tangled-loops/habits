module.exports = {
  // Standard prettier options
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  // Since prettier 3.0, manually specifying plugins is required
  plugins: [
    require('@ianvs/prettier-plugin-sort-imports'),
    'prettier-plugin-tailwindcss',
  ],
  // sort-imports
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^[.]',
    '',
    '^@/(.*)$',
    '',
    "^~/(.*)$",
    '',
    '^$/(.*)$',
    '',
    "^~api/(.*)$",
    '',
    '^~db/(.*)$',
    '',
    "^$ui/(.*)$",
    '',
    '^$components/(.*)$',
  ],
};
