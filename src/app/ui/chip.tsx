import React from 'react';
import {
  TagStatus,
  TagStatuses,
  TagValueType,
  TagValueTypes,
  TaskStatus,
  TaskStatuses,
  SegmentStatus,
  SegmentStatuses,
} from '@/app/lib/model';
import { Chip } from '@nextui-org/react';

type ChipColors =
  | 'success'
  | 'default'
  | 'danger'
  | 'primary'
  | 'secondary'
  | 'warning'
  | undefined;

interface ChipProperty {
  color: ChipColors;
  text: string;
}

const segmentStatusChipProperties: Record<SegmentStatus, ChipProperty> = {
  [SegmentStatus.Normal]: {
    color: 'success',
    text: SegmentStatuses[SegmentStatus.Normal],
  },
  [SegmentStatus.Deleted]: {
    color: 'danger',
    text: SegmentStatuses[SegmentStatus.Deleted],
  },
};

const tagStatusChipProperties: Record<TagStatus, ChipProperty> = {
  [TagStatus.Normal]: {
    color: 'success',
    text: TagStatuses[TagStatus.Normal],
  },
  [TagStatus.Deleted]: {
    color: 'danger',
    text: TagStatuses[TagStatus.Deleted],
  },
};

const taskStatusChipProperties: Record<TaskStatus, ChipProperty> = {
  [TaskStatus.Success]: {
    color: 'success',
    text: TaskStatuses[TaskStatus.Success],
  },
  [TaskStatus.Failed]: {
    color: 'danger',
    text: TaskStatuses[TaskStatus.Failed],
  },
  [TaskStatus.Pending]: {
    color: 'default',
    text: TaskStatuses[TaskStatus.Pending],
  },
  [TaskStatus.Running]: {
    color: 'primary',
    text: TaskStatuses[TaskStatus.Running],
  },
};

const tagValueTypeChipProperties: Record<TagValueType, ChipProperty> = {
  [TagValueType.Str]: {
    color: 'primary',
    text: TagValueTypes[TagValueType.Str],
  },
  [TagValueType.Int]: {
    color: 'secondary',
    text: TagValueTypes[TagValueType.Int],
  },
  [TagValueType.Float]: {
    color: 'default',
    text: TagValueTypes[TagValueType.Float],
  },
};

type LabelType = 'tagStatus' | 'taskStatus' | 'tagValueType' | 'segmentStatus';

export default function BaseChip({
  label,
  labelType,
}: {
  label: TagStatus | TaskStatus | TagValueType | SegmentStatus;
  labelType: LabelType;
}) {
  let chipProperty: ChipProperty | undefined;

  switch (labelType) {
    case 'tagStatus':
      chipProperty = tagStatusChipProperties[label as TagStatus];
      break;
    case 'taskStatus':
      chipProperty = taskStatusChipProperties[label as TaskStatus];
      break;
    case 'segmentStatus':
      chipProperty = segmentStatusChipProperties[label as SegmentStatus];
      break;
    case 'tagValueType':
      chipProperty = tagValueTypeChipProperties[label as TagValueType];
      break;
    default:
      chipProperty = undefined;
  }

  if (!chipProperty) {
    return null;
  }

  return <Chip color={chipProperty.color}>{chipProperty.text}</Chip>;
}
