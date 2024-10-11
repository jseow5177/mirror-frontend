import React from 'react';
import { TagStatus } from '@/app/lib/model';
import { Chip } from '@nextui-org/react';

type availableColors =
  | 'success'
  | 'default'
  | 'danger'
  | 'primary'
  | 'secondary'
  | 'warning'
  | undefined;

interface chipProperty {
  color: availableColors;
  label: string;
}

const chipProperties: Record<TagStatus, chipProperty> = {
  [TagStatus.Normal]: {
    color: 'success',
    label: 'Normal',
  },
  [TagStatus.Deleted]: {
    color: 'danger',
    label: 'Deleted',
  },
};

export default function TagStatusChip({ status }: { status: TagStatus }) {
  const chipProperty = chipProperties[status];

  return <Chip color={chipProperty.color}>{chipProperty.label}</Chip>;
}
