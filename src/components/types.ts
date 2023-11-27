export type MenuItem = {
  id: string;
  text: string;
  subItems?: MenuItem[];
};

export type Reorder = {
  list: MenuItem[];
  startIndex: number;
  endIndex: number;
};
