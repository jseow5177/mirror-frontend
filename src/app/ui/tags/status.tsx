import React from 'react';
import {
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
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
  icon: React.ElementType;
}

const chipProperties: Record<TagStatus, chipProperty> = {
  [TagStatus.Normal]: {
    color: 'success',
    label: 'Normal',
    icon: CheckIcon,
  },
  [TagStatus.Pending]: {
    color: 'default',
    label: 'Pending',
    icon: ClockIcon,
  },
  [TagStatus.Deleted]: {
    color: 'danger',
    label: 'Deleted',
    icon: ExclamationTriangleIcon,
  },
};

export default function Status({ status }: { status: TagStatus }) {
  const chipProperty = chipProperties[status];

  return <Chip color={chipProperty.color}>{chipProperty.label}</Chip>;
}
