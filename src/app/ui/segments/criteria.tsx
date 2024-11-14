'use client';

import { useState, useEffect } from 'react';
import { Tag, TagValueType } from '@/app/lib/model/tag';
import { RadioGroup, Radio, Button } from '@nextui-org/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Select, SelectItem, Input } from '@nextui-org/react';

enum LookupOp {
  Eq = '=',
  NEq = '!=',
  Lte = '<=',
  Lt = '<',
  Gte = '>=',
  Gt = '>',
}

type LookupCond = {
  tagID?: number;
  op?: LookupOp | null;
  value?: string | null;
};

const supportedOps: Record<TagValueType, LookupOp[]> = {
  [TagValueType.Str]: [LookupOp.Eq, LookupOp.NEq],
  [TagValueType.Int]: [
    LookupOp.Eq,
    LookupOp.NEq,
    LookupOp.Lte,
    LookupOp.Lt,
    LookupOp.Gte,
    LookupOp.Gt,
  ],
  [TagValueType.Float]: [
    LookupOp.Eq,
    LookupOp.NEq,
    LookupOp.Lte,
    LookupOp.Lt,
    LookupOp.Gte,
    LookupOp.Gt,
  ],
};

enum QueryOp {
  AND = 'AND',
  OR = 'OR',
}

type QueryCond = {
  lookup: LookupCond;
  prevOp?: QueryOp;
};

type Criteria = {
  queries: QueryCond[];
};

export function CriteriaInput({
  criteria,
  tags,
  onChange,
}: {
  criteria: string;
  tags: Tag[];
  onChange?: (criteria: string) => void;
}) {
  const [queries, setQueries] = useState<QueryCond[]>(
    parseCriteria(JSON.parse(criteria))
  );

  useEffect(() => {
    if (onChange) {
      onChange(
        JSON.stringify({
          queries,
        })
      );
    }
  }, [queries]);

  const deleteQuery = (i: number) => {
    const newQueries = [...queries.slice(0, i), ...queries.slice(i + 1)];
    if (i == 0) {
      newQueries[i].prevOp = undefined;
    }
    setQueries(newQueries);
  };

  const handleQueryOpChange = (i: number, v: string) => {
    const newQueries = [...queries];
    const newQuery = { ...queries[i], prevOp: v as QueryOp };

    newQueries[i] = newQuery;
    setQueries(newQueries);
  };

  const handleLookupChange = (i: number, lookup: LookupCond) => {
    const newQueries = [...queries];
    const newQuery = {
      ...queries[i],
      lookup: lookup,
    };

    newQueries[i] = newQuery;
    setQueries(newQueries);
  };

  const getSupportedOps = (tagID: number) => {
    const tag = findTag(tagID);
    return supportedOps[tag?.value_type || TagValueType.Int];
  };

  const isNumeric = (tagID: number) => {
    const tag = findTag(tagID);
    return (
      tag?.value_type === TagValueType.Int ||
      tag?.value_type === TagValueType.Float
    );
  };

  const findTag = (tagID: number) => tags.find((tag) => tag.id === tagID);

  return (
    <div className='w-full'>
      {queries.map((query, i) => {
        return (
          <div key={i} className='mb-2 flex w-full flex-col'>
            {query.prevOp && (
              <div className='mb-2 flex w-full justify-center'>
                <RadioGroup
                  id='queryOp'
                  orientation='horizontal'
                  value={query.prevOp}
                  onValueChange={(v) => {
                    handleQueryOpChange(i, v);
                  }}
                >
                  <Radio value={QueryOp.AND}>{QueryOp.AND}</Radio>
                  <Radio value={QueryOp.OR}>{QueryOp.OR}</Radio>
                </RadioGroup>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <div className='flex w-full gap-2'>
                <Select
                  aria-label='tag'
                  placeholder='Tag'
                  variant='bordered'
                  size='lg'
                  selectedKeys={
                    query.lookup.tagID ? [`${query.lookup.tagID}`] : []
                  }
                  onChange={(e) => {
                    handleLookupChange(i, {
                      ...query.lookup,
                      tagID: Number(e.target.value),
                    });
                  }}
                >
                  {tags.map((tag) => (
                    <SelectItem key={tag.id || 0}>{tag.name}</SelectItem>
                  ))}
                </Select>
                <Select
                  aria-label='lookupOp'
                  placeholder='Operator'
                  variant='bordered'
                  size='lg'
                  isDisabled={query.lookup.tagID === undefined}
                  selectedKeys={query.lookup.op ? [query.lookup.op] : []}
                  onChange={(e) => {
                    handleLookupChange(i, {
                      ...query.lookup,
                      op: e.target.value as LookupOp,
                    });
                  }}
                >
                  {getSupportedOps(query.lookup.tagID || 0).map((op) => (
                    <SelectItem key={op}>{op}</SelectItem>
                  ))}
                </Select>
                <Input
                  id={`${i}`}
                  aria-label='value'
                  name='value'
                  variant='bordered'
                  type={isNumeric(query.lookup.tagID || 0) ? 'number' : 'text'}
                  size='lg'
                  placeholder='Value'
                  isDisabled={query.lookup.op === undefined}
                  value={query.lookup.value || ''}
                  onValueChange={(v) => {
                    handleLookupChange(i, {
                      ...query.lookup,
                      value: v,
                    });
                  }}
                />
              </div>
              <Button
                isIconOnly
                color='danger'
                variant='light'
                onClick={() => deleteQuery(i)}
              >
                <TrashIcon className='w-5' />
              </Button>
            </div>
          </div>
        );
      })}
      <div className='flex w-full justify-center'>
        <Button
          variant='light'
          startContent={<PlusIcon className='w-5' />}
          onClick={() => {
            setQueries([
              ...queries,
              {
                lookup: {},
                prevOp: queries.length === 0 ? undefined : QueryOp.AND,
              },
            ]);
          }}
        >
          Add Query
        </Button>
      </div>
    </div>
  );
}

export function CriteriaView({
  criteria,
  tags,
}: {
  criteria: string;
  tags: Tag[];
}) {
  const queries = parseCriteria(JSON.parse(criteria));

  const getTag = (id: number) => {
    return tags.find((tag) => tag.id === id);
  };

  return (
    <div>
      {queries.map((query, i) => {
        const lookup = query.lookup;
        return (
          <div key={i} className='flex flex-col items-center'>
            {query.prevOp && <p className='my-2'>{query.prevOp}</p>}
            <div className='flex justify-center gap-2'>
              <p>{getTag(lookup.tagID || 0)?.name}</p>
              <p>{lookup.op}</p>
              <p>{lookup.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function parseCriteria(jsonData: any): QueryCond[] {
  if (!Array.isArray(jsonData.queries)) {
    return [];
  }

  const parsedData: Criteria = {
    queries: jsonData.queries.map((query: any) => {
      return {
        lookup: {
          tagID: query.lookup.tagID,
          op: query.lookup.op,
          value: query.lookup.value,
        },
        prevOp: query.prevOp,
      };
    }),
  };

  return parsedData.queries;
}
