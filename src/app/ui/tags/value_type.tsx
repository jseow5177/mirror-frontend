import React from 'react';
import { TagValueType, TagValueTypes } from '@/app/lib/model';
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
}

const chipProperties: Record<TagValueType, chipProperty> = {
  [TagValueType.Int]: {
    color: 'secondary',
  },
  [TagValueType.Str]: {
    color: 'primary',
  },
  [TagValueType.Float]: {
    color: 'default',
  },
};

export default function TagValueTypeChip({
  tagValueType,
}: {
  tagValueType: TagValueType;
}) {
  const chipProperty = chipProperties[tagValueType];

  return <Chip color={chipProperty.color}>{TagValueTypes[tagValueType]}</Chip>;
}
