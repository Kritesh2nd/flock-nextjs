export const getArticleImageUrl = (imagePath: string) => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/article/image-path/${imagePath}`;
};
