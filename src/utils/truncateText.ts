/**
 * @param text - The string to truncate
 * @param maxLength - Maximum length allowed
 * @returns truncated string
 */
export const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
