'use client';

import { useEffect } from 'react';
import { Criteria, Lookup } from '@/app/lib/model/segment';
import { Tag } from '@/app/lib/model/tag';
import { useState } from 'react';
import { LookupBuilder } from './lookup-builder';
import {
  VisuallyHidden,
  useSwitch,
  SwitchProps,
  Button,
  Tooltip,
} from '@nextui-org/react';
import clsx from 'clsx';

const LOOKUP_LIMIT = 10;

const OP_AND = 'AND';
const OP_OR = 'OR';

interface OperatorToggleProps extends SwitchProps {
  op?: string;
  onOpChange?: (op: string) => void;
}

const OperatorToggle = ({
  op = OP_AND,
  onOpChange = () => {},
  ...props
}: OperatorToggleProps) => {
  const { Component, slots, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch(props);

  const [selectedOp, setSelectedOp] = useState(op === '' ? OP_AND : op);

  const handleClick = () => {
    const newOp = selectedOp === OP_AND ? OP_OR : OP_AND;
    setSelectedOp(newOp);
    onOpChange(newOp);
  };

  const lineStyle = clsx('w-[2px] flex-grow bg-blue-400', {
    'bg-green-400': selectedOp === 'AND',
  });

  return (
    <div className='flex flex-col items-center'>
      <div className={lineStyle} />
      <Component
        {...{
          ...getBaseProps(), // remove group class
          className:
            'relative max-w-fit inline-flex items-center justify-start cursor-pointer touch-none tap-highlight-transparent select-none',
        }}
        onClick={handleClick}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              'flex items-center justify-center rounded-lg',
              selectedOp === 'AND'
                ? 'bg-green-200 text-green-800'
                : 'bg-blue-200 text-blue-800',
            ],
          })}
        >
          {<p>{selectedOp}</p>}
        </div>
      </Component>
      <div className={lineStyle} />
    </div>
  );
};

type QueryProps = {
  tags: Tag[];
  initialCriteria?: Criteria;
  onChange?: (criteria: Criteria) => void;
};

const emptyCriteria: Criteria = {
  queries: [
    {
      lookups: [
        {
          tag_id: 0,
        },
      ],
      op: '',
    },
  ],
  op: '',
};

export const QueryBuilder = ({
  tags,
  initialCriteria = emptyCriteria,
  onChange = () => {},
}: QueryProps) => {
  const [criteria, setCriteria] = useState<Criteria>(initialCriteria);

  useEffect(() => {
    onChange(criteria);
  }, [criteria]);

  const changeQueryOp = (op: string) => {
    setCriteria({ ...criteria, op: op });
  };

  const changeLookupOp = (queryIdx: number, op: string) => {
    setCriteria({
      ...criteria,
      queries: [
        ...criteria.queries.slice(0, queryIdx),
        {
          lookups: criteria.queries[queryIdx].lookups,
          op: op,
        },
        ...criteria.queries.slice(queryIdx + 1, criteria.queries.length),
      ],
    });
  };

  const changeLookup = (
    queryIdx: number,
    lookupIdx: number,
    lookup: Lookup
  ) => {
    setCriteria({
      ...criteria,
      queries: [
        ...criteria.queries.slice(0, queryIdx),
        {
          lookups: [
            ...criteria.queries[queryIdx].lookups.slice(0, lookupIdx),
            lookup,
            ...criteria.queries[queryIdx].lookups.slice(lookupIdx + 1),
          ],
          op: criteria.queries[queryIdx].op,
        },
        ...criteria.queries.slice(queryIdx + 1),
      ],
    });
  };

  const addLookup = (queryIdx: number) => {
    setCriteria({
      ...criteria,
      queries: [
        ...criteria.queries.slice(0, queryIdx),
        {
          lookups: [
            ...criteria.queries[queryIdx].lookups,
            {
              tag_id: 0,
            },
          ],
          op: criteria.queries[queryIdx].op,
        },
        ...criteria.queries.slice(queryIdx + 1),
      ],
    });
  };

  const addQuery = () => {
    setCriteria({
      ...criteria,
      queries: [
        ...criteria.queries,
        {
          lookups: [
            {
              tag_id: 0,
            },
          ],
          op: '',
        },
      ],
    });
  };

  const deleteLookup = (queryIdx: number, lookupIdx: number) => {
    setCriteria({
      ...criteria,
      queries: [
        ...criteria.queries.slice(0, queryIdx),
        {
          lookups: [
            ...criteria.queries[queryIdx].lookups.slice(0, lookupIdx),
            ...criteria.queries[queryIdx].lookups.slice(lookupIdx + 1),
          ],
          op: criteria.queries[queryIdx].op,
        },
        ...criteria.queries.slice(queryIdx + 1),
      ],
    });
  };

  const copyLookup = (queryIdx: number, lookupIdx: number) => {
    setCriteria({
      ...criteria,
      queries: [
        ...criteria.queries.slice(0, queryIdx),
        {
          lookups: [
            ...criteria.queries[queryIdx].lookups.slice(0, lookupIdx + 1),
            criteria.queries[queryIdx].lookups[lookupIdx],
            ...criteria.queries[queryIdx].lookups.slice(lookupIdx + 1),
          ],
          op: criteria.queries[queryIdx].op,
        },
        ...criteria.queries.slice(queryIdx + 1),
      ],
    });
  };

  const showAddQuery = () => {
    return (
      criteria?.queries &&
      (criteria.queries.length > 1 ||
        (criteria.queries.length == 1 &&
          criteria.queries[0].lookups.length > 1))
    );
  };

  const hasReachedLookupLimit = () => {
    let count = 0;
    criteria?.queries.forEach((queries) => {
      count += queries.lookups.length;
    });
    return count >= LOOKUP_LIMIT;
  };

  return (
    <div>
      <div className='flex'>
        {criteria?.queries && criteria.queries.length > 1 && (
          <OperatorToggle
            op={criteria.op}
            onOpChange={(op) => changeQueryOp(op)}
          />
        )}

        <div className='flex w-full flex-col'>
          {criteria.queries &&
            criteria.queries.map((query, queryIdx) => (
              <div>
                <div className='mb-2 flex' key={queryIdx}>
                  {query.lookups && query.lookups.length > 1 && (
                    <OperatorToggle
                      op={query.op}
                      onOpChange={(op) => changeLookupOp(queryIdx, op)}
                    />
                  )}
                  <div className='w-full'>
                    <div className='flex flex-col gap-2'>
                      {query.lookups &&
                        query.lookups.map((lookup, lookupIdx) => (
                          <LookupBuilder
                            key={lookupIdx}
                            tags={tags}
                            lookup={lookup}
                            onChange={(lookup) =>
                              changeLookup(queryIdx, lookupIdx, lookup)
                            }
                            onDelete={() => deleteLookup(queryIdx, lookupIdx)}
                            onCopy={() => copyLookup(queryIdx, lookupIdx)}
                            disableCopy={hasReachedLookupLimit()}
                          />
                        ))}
                    </div>
                    <div>
                      <Tooltip
                        color='foreground'
                        placement='right'
                        showArrow
                        isDisabled={!hasReachedLookupLimit()}
                        content={`Max ${LOOKUP_LIMIT} lookups`}
                      >
                        <span>
                          <Button
                            color='primary'
                            variant='light'
                            fullWidth={false}
                            onPress={(_) => addLookup(queryIdx)}
                            isDisabled={hasReachedLookupLimit()}
                          >
                            + Add Lookup
                          </Button>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {showAddQuery() && (
        <Tooltip
          color='foreground'
          placement='right'
          showArrow
          isDisabled={!hasReachedLookupLimit()}
          content={`Max ${LOOKUP_LIMIT} lookups`}
        >
          <span>
            <Button
              className='mt-2'
              color='primary'
              variant='light'
              fullWidth={false}
              onPress={addQuery}
              isDisabled={hasReachedLookupLimit()}
            >
              + Add Query
            </Button>
          </span>
        </Tooltip>
      )}
    </div>
  );
};
