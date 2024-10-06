import { TagStatus, TagValueType, Tag } from './model';

const now = Date.now();

const tags: Array<Tag> = [
  {
    tag_name: 'Age',
    tag_desc: 'Age of Users',
    tag_status: TagStatus.Normal,
    tag_value_type: TagValueType.Int,
    create_time: now,
    update_time: now,
  },
  {
    tag_name: 'Region',
    tag_desc: 'Region of Users',
    tag_status: TagStatus.Normal,
    tag_value_type: TagValueType.Str,
    create_time: now,
    update_time: now,
  },
];

export { tags };
