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
};

export enum SegmentStatus {
  Normal = 1,
  Deleted = 2,
}

export const SegmentStatuses: Record<SegmentStatus, string> = {
  [SegmentStatus.Normal]: 'Normal',
  [SegmentStatus.Deleted]: 'Deleted',
};

export type Segment = {
  id?: number;
  name: string;
  desc: string;
  status: SegmentStatus;
  criteria: Criteria;
  create_time: number;
  update_time: number;
};
