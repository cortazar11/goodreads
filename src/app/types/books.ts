export type BookWithAuthor = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
};