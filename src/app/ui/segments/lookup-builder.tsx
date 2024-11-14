'use client';

import { Lookup, LRange } from '@/app/lib/model/segment';
import { isTagNumeric, Tag } from '@/app/lib/model/tag';
import {
  Input,
  Select,
  SelectItem,
  SharedSelection,
  Button,
  ButtonGroup,
} from '@nextui-org/react';
import { TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import MultiSelectTextInput from '../multi-select-text';
import clsx from 'clsx';

const OP_EQ = { label: '=', key: 'eq' };
const OP_IN = { label: 'include', key: 'in' };
const OP_GT = { label: '>', key: 'gt' };
const OP_GTE = { label: '>=', key: 'gte' };
const OP_LT = { label: '<', key: 'lt' };
const OP_LTE = { label: '<=', key: 'lte' };

const strOps = [OP_EQ, OP_IN];
const numOps = [...strOps, OP_GT, OP_GTE, OP_LT, OP_LTE];

type LookupProps = {
  tags: Tag[];
  lookup: Lookup;
  disableCopy?: boolean;
  onChange?: (lookup: Lookup) => void;
  onDelete?: () => void;
  onCopy?: () => void;
};

export const LookupBuilder = ({
  tags,
  lookup,
  disableCopy = false,
  onChange = () => {},
  onDelete = () => {},
  onCopy = () => {},
}: LookupProps) => {
  const [showActionButtons, setShowActionButtons] = useState(false);

  useEffect(() => {
    onChange(lookup);
  }, [lookup]);

  const findTag = (tagID: number) => {
    return tags.find((tag) => tag.id === tagID);
  };

  const [tag, setTag] = useState<Tag>(findTag(lookup.tag_id || 0) || Object);

  const getInitialOp = () => {
    if (lookup?.eq !== undefined) return OP_EQ.key;
    if (lookup?.in !== undefined) return OP_IN.key;

    if (lookup?.range !== undefined) {
      if (lookup.range.gt !== undefined) return OP_GT.key;
      if (lookup.range.gte !== undefined) return OP_GTE.key;
      if (lookup.range.lt !== undefined) return OP_LT.key;
      if (lookup.range.lte !== undefined) return OP_LTE.key;
    }

    return '';
  };

  const [op, setOp] = useState(getInitialOp());

  const onTagChange = (e: SharedSelection) => {
    const tagID = Number(e.currentKey);
    setShowActionButtons(false);
    setTag(findTag(tagID)!);
    onChange({ ...lookup, tag_id: tagID });
  };

  const onOpChange = (e: SharedSelection) => {
    setShowActionButtons(false);
    setOp(e.currentKey!);
    onChange({ tag_id: lookup.tag_id }); // clear all values
  };

  const getLookupOps = () => {
    if (isTagNumeric(tag)) {
      return numOps;
    } else {
      return strOps;
    }
  };

  const setLookupValue = (v: string) => {
    if (op === undefined) {
      return;
    }

    if (strOps.some((v) => v.key === op)) {
      onChange({ ...lookup, [op]: v });
    } else {
      onChange({ ...lookup, range: { ...lookup.range, [op]: v } });
    }
  };

  const getLookupValue = () => {
    if (op === undefined) {
      return '';
    }

    if (strOps.some((v) => v.key === op)) {
      const v = lookup[op as keyof Lookup];
      return v ? `${v}` : '';
    } else if (lookup.range) {
      const v = lookup.range[op as keyof LRange];
      return v ? `${v}` : '';
    }

    return '';
  };

  const getValueInput = () => {
    if (op === OP_IN.key) {
      return (
        <MultiSelectTextInput
          initialValues={lookup.in || []}
          onChange={(v) => {
            onChange({ ...lookup, in: v });
          }}
          isNumeric={isTagNumeric(tag)}
        />
      );
    } else {
      return (
        <Input
          aria-label='Value'
          placeholder='Value'
          size='lg'
          variant='bordered'
          type={isTagNumeric(tag) ? 'number' : 'text'}
          isDisabled={op === ''}
          value={getLookupValue()}
          onValueChange={(v) => setLookupValue(v)}
        />
      );
    }
  };

  return (
    <div
      className={clsx(
        'flex justify-between rounded-md p-3 transition-all duration-300 ease-in-out',
        {
          'bg-gray-100': showActionButtons,
        }
      )}
      onMouseEnter={() => setShowActionButtons(true)}
      onMouseLeave={() => setShowActionButtons(false)}
    >
      <div className='flex w-[80%] items-start gap-4'>
        <Select
          className='w-[40%]'
          aria-label='Tag'
          placeholder='Tag'
          size='lg'
          variant='bordered'
          selectedKeys={[`${lookup.tag_id ? lookup.tag_id : ''}`]}
          onSelectionChange={onTagChange}
        >
          {tags.map((tag) => (
            <SelectItem key={`${tag.id!}`}>{tag.name}</SelectItem>
          ))}
        </Select>

        <Select
          className='w-[20%]'
          aria-label='Operator'
          placeholder='Operator'
          size='lg'
          variant='bordered'
          selectedKeys={[op ? `${op}` : '']}
          onSelectionChange={onOpChange}
          isDisabled={!tag.id}
        >
          {getLookupOps().map((op) => (
            <SelectItem key={op.key}>{op.label}</SelectItem>
          ))}
        </Select>

        <div className='w-[40%]'>{getValueInput()}</div>
      </div>

      <div className='flex w-[20%] justify-end'>
        {showActionButtons && (
          <ButtonGroup variant='light' size='md' className='gap-2'>
            {!disableCopy && (
              <Button
                isIconOnly
                color='default'
                aria-label='copy'
                size='sm'
                onPress={onCopy}
              >
                <DocumentDuplicateIcon />
              </Button>
            )}
            <Button
              isIconOnly
              color='danger'
              aria-label='delete'
              size='sm'
              onPress={onDelete}
            >
              <TrashIcon />
            </Button>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
};
