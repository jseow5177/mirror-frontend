'use client';

import { Lookup } from '@/app/_lib/model/segment';
import { isTagNumeric, Tag } from '@/app/_lib/model/tag';
import {
  Input,
  Select,
  SelectItem,
  SharedSelection,
  Button,
  ButtonGroup,
} from '@nextui-org/react';
import { TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import MultiSelectTextInput from '../multi-select-text';
import clsx from 'clsx';

const OP_EQ = '=';
const OP_IN = 'in';
const OP_GT = '>';
const OP_GTE = '>=';
const OP_LT = '<';
const OP_LTE = '<=';

const strOps = [OP_EQ, OP_IN];
const numOps = [...strOps, OP_GT, OP_GTE, OP_LT, OP_LTE];

type LookupProps = {
  tags: Tag[];
  lookup: Lookup;
  disableCopy?: boolean;
  hideDelete?: boolean;
  onChange?: (lookup: Lookup) => void;
  onDelete?: () => void;
  onCopy?: () => void;
  readonly?: boolean;
};

export const LookupBuilder = ({
  tags,
  lookup,
  disableCopy = false,
  hideDelete = false,
  onChange = () => {},
  onDelete = () => {},
  onCopy = () => {},
  readonly = false,
}: LookupProps) => {
  const [showActionButtons, setShowActionButtons] = useState(false);

  const findTag = (tagID: number) => {
    return tags.find((tag) => tag.id === tagID);
  };

  const [tag, setTag] = useState<Tag>(findTag(lookup.tag_id || 0) || Object);

  const getLookupSupportedOps = () => {
    if (isTagNumeric(tag)) {
      return numOps;
    } else {
      return strOps;
    }
  };

  const getLookupOp = () => {
    const op = getLookupSupportedOps().find((op) => op === lookup.op);
    return op || '';
  };

  const onTagChange = (e: SharedSelection) => {
    if (!e.currentKey) {
      return;
    }
    toggleShowActionButtons(false);

    const tagID = Number(e.currentKey);
    setTag(findTag(tagID)!);
    onChange({ tag_id: tagID });
  };

  const onOpChange = (e: SharedSelection) => {
    if (!e.currentKey) {
      return;
    }
    toggleShowActionButtons(false);

    if (e.currentKey === OP_IN) {
      setLookupValue(e.currentKey, []);
    } else {
      setLookupValue(e.currentKey, lookup.val); // retain old value
    }
  };

  const setLookupValue = (op: string, v: string | string[]) => {
    if (op === undefined) {
      return;
    }

    onChange({ tag_id: lookup.tag_id, op: op, val: v });
  };

  const getValueInput = (op: string) => {
    if (op === OP_IN) {
      return (
        <MultiSelectTextInput
          initialValues={lookup.val || []}
          onChange={(v) => setLookupValue(op, v)}
          isNumeric={isTagNumeric(tag)}
          isDisabled={readonly}
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
          isDisabled={op === '' || readonly}
          value={lookup.val || ''}
          onChange={(e) => setLookupValue(op, e.target.value)}
        />
      );
    }
  };

  const toggleShowActionButtons = (b: boolean) => {
    if (!readonly) {
      setShowActionButtons(b);
    }
  };

  return (
    <div
      className={clsx(
        'flex justify-between rounded-md py-2 pl-1 pr-3 transition-all duration-300 ease-in-out',
        {
          'bg-gray-100': showActionButtons,
        }
      )}
      onMouseEnter={() => toggleShowActionButtons(true)}
      onMouseLeave={() => toggleShowActionButtons(false)}
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
          isDisabled={readonly}
        >
          {tags.map((tag) => (
            <SelectItem key={tag.id!}>{tag.name}</SelectItem>
          ))}
        </Select>

        <Select
          className='w-[20%]'
          aria-label='Operator'
          placeholder='Operator'
          size='lg'
          variant='bordered'
          selectedKeys={[getLookupOp() ? `${getLookupOp()}` : '']}
          onSelectionChange={onOpChange}
          isDisabled={!tag.id || readonly}
        >
          {getLookupSupportedOps().map((op) => (
            <SelectItem key={op}>{op}</SelectItem>
          ))}
        </Select>

        <div className='w-[40%]'>{getValueInput(getLookupOp())}</div>
      </div>

      {showActionButtons && (
        <div className='flex w-[20%] justify-end'>
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
            {!hideDelete && (
              <Button
                isIconOnly
                color='danger'
                aria-label='delete'
                size='sm'
                onPress={onDelete}
              >
                <TrashIcon />
              </Button>
            )}
          </ButtonGroup>
        </div>
      )}
    </div>
  );
};
