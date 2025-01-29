'use client';

import { useEffect } from 'react';
import { Criteria, Lookup } from '@/app/_lib/model/segment';
import { Tag } from '@/app/_lib/model/tag';
import { useState } from 'react';
import { LookupBuilder } from './lookup-builder';
import {
  VisuallyHidden,
  useSwitch,
  SwitchProps,
  Tooltip,
  Link,
} from '@nextui-org/react';
import clsx from 'clsx';

const LOOKUP_LIMIT = 10;

const OP_AND = 'AND';
const OP_OR = 'OR';

interface OperatorToggleProps extends SwitchProps {
  op?: string;
  onOpChange?: (op: string) => void;
  readonly?: boolean;
}

const OperatorToggle = ({
  op = OP_AND,
  onOpChange = () => {},
  readonly = false,
  ...props
}: OperatorToggleProps) => {
  const { Component, slots, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch({ ...props, isDisabled: readonly });

  const [selectedOp, setSelectedOp] = useState(op === '' ? OP_AND : op);

  const handleClick = () => {
    if (!readonly) {
      const newOp = selectedOp === OP_AND ? OP_OR : OP_AND;
      setSelectedOp(newOp);
      onOpChange(newOp);
    }
  };

  const lineStyle = clsx('w-[2px] flex-grow bg-blue-400', {
    'bg-green-400': selectedOp === OP_AND,
  });

  return (
    <div className='flex flex-col items-center'>
      <div className={lineStyle} />
      <Component
        {...{
          ...getBaseProps(), // remove group class
          className: clsx(
            'relative max-w-fit inline-flex items-center justify-start touch-none tap-highlight-transparent select-none',
            {
              'cursor-default': readonly,
              'cursor-pointer': !readonly,
            }
          ),
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
              selectedOp === OP_AND
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
  initialCriteria: Criteria;
  onChange?: (criteria: Criteria) => void;
  readonly?: boolean;
};

export const emptyCriteria: Criteria = {
  queries: [
    {
      lookups: [
        {
          tag_id: 0,
        },
      ],
      op: OP_AND,
    },
  ],
  op: OP_AND,
};

export const QueryBuilder = ({
  tags,
  initialCriteria,
  onChange = () => {},
  readonly = false,
}: QueryProps) => {
  const [criteria, setCriteria] = useState<Criteria>(
    !initialCriteria.queries || initialCriteria.queries.length === 0
      ? emptyCriteria
      : initialCriteria
  );

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
          op: OP_AND,
        },
      ],
    });
  };

  const deleteLookup = (queryIdx: number, lookupIdx: number) => {
    const updatedQueries = criteria.queries
      .map((query, index) => {
        if (index === queryIdx) {
          const updatedLookups = [
            ...query.lookups.slice(0, lookupIdx),
            ...query.lookups.slice(lookupIdx + 1),
          ];

          return updatedLookups.length > 0
            ? { ...query, lookups: updatedLookups }
            : null;
        }
        return query;
      })
      .filter((query) => query !== null);

    setCriteria({
      ...criteria,
      queries: updatedQueries,
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

  const showAddLookup = () => {
    return !readonly;
  };

  const showAddQuery = () => {
    return (
      !readonly &&
      criteria?.queries &&
      (criteria.queries.length > 1 ||
        (criteria.queries.length == 1 &&
          criteria.queries[0].lookups.length > 1))
    );
  };

  const isMaxLookup = () => {
    return getLookupCount() >= LOOKUP_LIMIT;
  };

  const isMinLookup = () => {
    return getLookupCount() === 1;
  };

  const getLookupCount = () => {
    let count = 0;
    criteria?.queries.forEach((queries) => {
      count += queries.lookups.length;
    });
    return count;
  };

  return (
    <div>
      <div className='flex'>
        {criteria?.queries && criteria.queries.length > 1 && (
          <OperatorToggle
            op={criteria.op}
            onOpChange={(op) => changeQueryOp(op)}
            readonly={readonly}
          />
        )}

        <div className='flex w-full flex-col'>
          {criteria.queries &&
            criteria.queries.map((query, queryIdx) => (
              <div className='mb-2 flex' key={queryIdx}>
                {query.lookups && query.lookups.length > 1 && (
                  <OperatorToggle
                    op={query.op}
                    onOpChange={(op) => changeLookupOp(queryIdx, op)}
                    readonly={readonly}
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
                          disableCopy={isMaxLookup()}
                          hideDelete={isMinLookup()}
                          readonly={readonly}
                        />
                      ))}
                  </div>
                  {showAddLookup() && (
                    <div>
                      <Tooltip
                        color='foreground'
                        placement='right'
                        showArrow
                        isDisabled={!isMaxLookup()}
                        content={`Max ${LOOKUP_LIMIT} lookups`}
                      >
                        <span>
                          <Link
                            href='#'
                            className='mt-4'
                            isDisabled={isMaxLookup()}
                            size='sm'
                            onPress={(_) => addLookup(queryIdx)}
                          >
                            + Add Lookup
                          </Link>
                        </span>
                      </Tooltip>
                    </div>
                  )}
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
          isDisabled={!isMaxLookup()}
          content={`Max ${LOOKUP_LIMIT} lookups`}
        >
          <span>
            <Link
              href='#'
              className='mt-4'
              isDisabled={isMaxLookup()}
              onPress={addQuery}
              size='sm'
            >
              + Add Query
            </Link>
          </span>
        </Tooltip>
      )}
    </div>
  );
};
