export type Lookup = {
  tag_id: number;
  eq?: string;
  In?: string[];
  Range?: {
    lte?: string;
    lt?: string;
    gte?: string;
    gt?: string;
  };
};

export type Query = {
  queries?: Array<Query>;
  lookups?: Array<Lookup>;
  op: string;
};
