export type LRange = {
  lte?: string;
  lt?: string;
  gte?: string;
  gt?: string;
};

export type Lookup = {
  tag_id?: number;
  eq?: string;
  in?: string[];
  range?: LRange;
};

export type Query = {
  lookups: Lookup[];
  op: string;
};

export type Criteria = {
  queries: Query[];
  op: string;
}