'use client';

import { Lookup } from '@/app/_lib/model/segment';
import { isTagNumeric, Tag } from '@/app/_lib/model/tag';
import {
  Select,
  SelectItem,
  SharedSelection,
  Button,
  ButtonGroup,
  Autocomplete,
  AutocompleteItem,
} from '@heroui/react';
import { TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { getDistinctTagValues } from '@/app/_lib/data/tag';
import {
  ControlProps,
  CSSObjectWithLabel,
  GroupBase,
  default as ReactSelect,
  Theme,
} from 'react-select';
import Creatable from 'react-select/creatable';

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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const findTag = (tagID: number) => {
    return tags.find((tag) => tag.id === tagID);
  };

  const [tag, setTag] = useState<Tag>(findTag(lookup.tag_id || 0) || Object);

  const [distinctTagValues, setDistinctTagValues] = useState<string[]>([]);
  const [isLoadingTagValues, setIsLoadingTagValues] = useState(false);

  useEffect(() => {
    if (tag.id && tag.id > 0) {
      (async () => {
        try {
          setIsLoadingTagValues(true);
          const values = await getDistinctTagValues(tag.id || 0);
          setDistinctTagValues(values);
        } catch {
          setDistinctTagValues([]);
        } finally {
          setIsLoadingTagValues(false);
        }
      })();
    } else {
      setDistinctTagValues([]);
    }
  }, [tag]);

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

  const onTagChange = (e: string | number | null) => {
    if (!e) {
      return;
    }
    toggleShowActionButtons(false);

    const tagID = Number(e);
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
      setLookupValue(e.currentKey, '');
    }
  };

  const setLookupValue = (op: string, v: string | string[] | null) => {
    if (op === undefined) {
      return;
    }

    onChange({ tag_id: lookup.tag_id, op: op, val: v });
  };

  const toSelectOptions = (arr: string[]) =>
    arr.map((v) => ({
      label: v,
      value: v,
    }));

  const getInputTheme = (theme: Theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: 'black',
    },
  });

  const getInputControlStyles = (
    baseStyles: CSSObjectWithLabel,
    state: ControlProps<
      {
        label: any;
        value: any;
      },
      boolean,
      GroupBase<{
        label: any;
        value: any;
      }>
    >
  ) => ({
    ...baseStyles,
    borderColor: state.isFocused ? 'black' : '#E4E7EB',
    borderWidth: state.isFocused ? '1.5px' : '2px',
    borderRadius: '12px',
    backgroundColor: 'white',
  });

  const getInputMultiValueStyles = (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    backgroundColor: 'white',
    borderColor: '#E4E7EB',
    borderWidth: '1px',
    borderRadius: '8px',
  });

  const getValueInputV2 = (op: string) => {
    // solve next hydration error
    if (isMounted) {
      if (op === OP_IN) {
        if (distinctTagValues.length > 0) {
          return (
            <ReactSelect
              isMulti
              options={toSelectOptions(distinctTagValues)}
              value={toSelectOptions(lookup.val as string[])}
              onChange={(newValue) => {
                setLookupValue(
                  op,
                  newValue.length > 0 ? newValue.map((v) => v.value) : null
                );
              }}
              isSearchable
              isClearable
              isLoading={isLoadingTagValues}
              isDisabled={readonly}
              theme={(theme) => getInputTheme(theme)}
              styles={{
                control: (baseStyles, state) =>
                  getInputControlStyles(baseStyles, state),
                multiValue: (baseStyles) =>
                  getInputMultiValueStyles(baseStyles),
              }}
            />
          );
        } else {
          return (
            <Creatable
              isClearable
              isMulti
              value={toSelectOptions(lookup.val as string[])}
              onChange={(newValue) =>
                setLookupValue(
                  op,
                  newValue.length > 0 ? newValue.map((v) => v.value) : null
                )
              }
              isValidNewOption={(v) => {
                if (isTagNumeric(tag)) {
                  return v !== '' && !Number.isNaN(Number(v));
                }
                return true;
              }}
              isDisabled={readonly}
              theme={(theme) => getInputTheme(theme)}
              styles={{
                control: (baseStyles, state) =>
                  getInputControlStyles(baseStyles, state),
                multiValue: (baseStyles) =>
                  getInputMultiValueStyles(baseStyles),
              }}
            />
          );
        }
      } else {
        if (distinctTagValues.length > 0) {
          return (
            <ReactSelect
              options={toSelectOptions(distinctTagValues)}
              value={{
                label: lookup.val,
                value: lookup.val,
              }}
              onChange={(newValue) => {
                setLookupValue(op, newValue ? newValue.value : '');
              }}
              isSearchable
              isClearable
              isLoading={isLoadingTagValues}
              isDisabled={op === '' || readonly}
              theme={(theme) => getInputTheme(theme)}
              styles={{
                control: (baseStyles, state) =>
                  getInputControlStyles(baseStyles, state),
                multiValue: (baseStyles) =>
                  getInputMultiValueStyles(baseStyles),
              }}
            />
          );
        } else {
          return (
            <Creatable
              isClearable
              value={{
                label: lookup.val,
                value: lookup.val,
              }}
              onChange={(newValue) =>
                setLookupValue(op, newValue ? newValue.value : '')
              }
              isValidNewOption={(v) => {
                if (isTagNumeric(tag)) {
                  return v !== '' && !Number.isNaN(Number(v));
                }
                return true;
              }}
              isDisabled={op === '' || readonly}
              theme={(theme) => getInputTheme(theme)}
              styles={{
                control: (baseStyles, state) =>
                  getInputControlStyles(baseStyles, state),
                multiValue: (baseStyles) =>
                  getInputMultiValueStyles(baseStyles),
              }}
            />
          );
        }
      }
    } else {
      return <></>;
    }
  };

  const toggleShowActionButtons = (b: boolean) => {
    if (!readonly) {
      setShowActionButtons(b);
    }
  };

  return (
    <div
      className={clsx('flex justify-between rounded-md px-3 py-3', {
        'outline-dashed outline-2 outline-blue-500': showActionButtons,
      })}
      onMouseEnter={() => toggleShowActionButtons(true)}
      onMouseLeave={() => toggleShowActionButtons(false)}
      onBlur={() => toggleShowActionButtons(false)}
    >
      <div className='flex w-[80%] items-start gap-4'>
        <Autocomplete
          className='w-[40%]'
          aria-label='Tag'
          placeholder='Tag'
          variant='bordered'
          isDisabled={readonly}
          selectedKey={`${lookup.tag_id ? lookup.tag_id : ''}`}
          onSelectionChange={onTagChange}
        >
          {tags.map((tag) => (
            <AutocompleteItem key={tag.id!}>{tag.name}</AutocompleteItem>
          ))}
        </Autocomplete>

        <Select
          className='w-[20%]'
          aria-label='Operator'
          placeholder='Operator'
          variant='bordered'
          selectedKeys={[getLookupOp() ? `${getLookupOp()}` : '']}
          onSelectionChange={onOpChange}
          isDisabled={!tag.id || readonly}
        >
          {getLookupSupportedOps().map((op) => (
            <SelectItem key={op}>{op}</SelectItem>
          ))}
        </Select>

        <div className='w-[40%]'>{getValueInputV2(getLookupOp())}</div>
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
