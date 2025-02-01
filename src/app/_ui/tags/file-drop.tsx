'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Image,
} from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { InformationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tag, TagValueType } from '../../_lib/model/tag';
import { redirect } from 'next/navigation';
import clsx from 'clsx';
import { createFileUploadTask, TaskState } from '@/app/_lib/action/task';

const COL_ID = 'id';
const COL_VAL = 'value';

const FILE_SIZE_LIMIT = 5_000_000;
const ROWS_PER_PAGE = 10;
const MAX_PREVIEW_ROWS = 100;

export default function DragAndDrop({ tag }: { tag: Tag }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [page, setPage] = useState(1);
  const [errMsg, setErrMsg] = useState('');

  const sampleDir = () => {
    switch (tag.value_type) {
      case TagValueType.Int:
        return 'int';
      case TagValueType.Str:
        return 'str';
      case TagValueType.Float:
        return 'float';
    }
  };

  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return previewData.slice(start, end);
  }, [page, previewData]);

  const pages = Math.ceil(previewData.length / ROWS_PER_PAGE);

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEnter(e);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleMouseLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHoverActive(false);
  };

  const handleMouseOver = (e: React.DragEvent<HTMLDivElement>) => {
    handleMouseEnter(e);
  };

  const handleMouseEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHoverActive(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    resetOnChange();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const resetOnChange = () => {
    setErrMsg('');
    setPage(1);
  };

  const removeFile = () => {
    setFile(null);
    resetOnChange();
  };

  const validateAndSetFile = (file: File) => {
    if (!['text/plain', 'text/csv'].includes(file.type)) {
      setErrMsg('File type not supported');
      return;
    }

    if (file.size > FILE_SIZE_LIMIT) {
      setErrMsg('File too large');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) {
        setErrMsg('Failed to read file');
        return;
      }

      const text = event.target.result as string;
      const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== '');

      if (lines.length === 0) {
        setErrMsg('File is empty');
        return;
      }

      const parsedData = lines.map((line) => line.split(','));

      if (parsedData[0].length !== 2) {
        setErrMsg('File must contain exactly two columns');
        return;
      }

      const header = parsedData[0];

      if (header[0] !== COL_ID || header[1] !== COL_VAL) {
        setErrMsg(`File must have two headers: '${COL_ID}' and '${COL_VAL}'`);
        return;
      }

      setFile(file);
      setPreviewData(parsedData.slice(1, MAX_PREVIEW_ROWS));
    };

    reader.readAsText(file);
  };

  const openFileExplorer = () => {
    if (inputRef.current) {
      inputRef.current.value = ''; // clear
      inputRef.current.click();
    }
  };

  const initialState: TaskState = {
    fieldErrors: {},
    message: null,
    error: null,
  };

  const handleFileUpload = (s: TaskState, formData: FormData) => {
    if (file) {
      formData.append('file', file);
    }
    formData.append('resource_id', `${tag.id}`);
    return createFileUploadTask(s, formData);
  };

  const [state, formAction, pending] = useActionState(
    handleFileUpload,
    initialState
  );

  useEffect(() => {
    if (!state.fieldErrors) {
      if (state.error) {
        toast.error(state.error ? state.error : 'Error encountered');
      } else {
        if (state.message) {
          toast.success(state.message);
        }
        redirect(`/dashboard/tags/${tag.id}`);
      }
    }
  }, [state]);

  return (
    <div className='w-[35rem]'>
      <form action={formAction}>
        {file ? (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px auto',
                rowGap: '16px',
                marginBottom: '16px',
                alignItems: 'center',
              }}
            >
              <p>
                <strong>File:</strong>
              </p>
              <div className='flex flex-row items-center'>
                <p>{file.name}</p>
                <Button
                  isIconOnly
                  color='danger'
                  onPress={() => removeFile()}
                  size='sm'
                  variant='light'
                  className='ml-2'
                >
                  <TrashIcon />
                </Button>
              </div>

              <p className='flex gap-1'>
                <strong>Preview:</strong>
                <Tooltip
                  showArrow
                  content='First 100 rows only'
                  color='default'
                  placement='right'
                >
                  <InformationCircleIcon className='w-4' />
                </Tooltip>
              </p>
            </div>
            <Table
              aria-label='preview-table'
              className='my-4'
              fullWidth
              bottomContent={
                <div className='flex w-full justify-center'>
                  <Pagination
                    isCompact
                    size='sm'
                    showControls
                    color='primary'
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              }
            >
              <TableHeader>
                <TableColumn>{COL_ID}</TableColumn>
                <TableColumn>{COL_VAL}</TableColumn>
              </TableHeader>
              <TableBody>
                {items.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell>{row[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button
              type='submit'
              color='primary'
              className='mt-3'
              disabled={file === null}
              isLoading={pending}
              fullWidth
            >
              Submit
            </Button>
          </div>
        ) : (
          <>
            <input
              id='file'
              name='file'
              className='hidden'
              ref={inputRef}
              type='file'
              multiple={false}
              accept='.csv,.txt'
              onChange={handleChange}
            />
            <div
              className={clsx(
                'flex h-[10rem] flex-col items-center justify-center gap-2 rounded-lg bg-gray-100 p-4 text-center',
                {
                  'cursor-pointer border-2 border-dashed border-primary':
                    dragActive || hoverActive,
                }
              )}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseOver={handleMouseOver}
              onClick={openFileExplorer}
            >
              <p>Drop file here, or click to select</p>
              <p className='text-sm text-gray-500'>
                Accepts .csv or .txt, max 5MB
              </p>
            </div>
            <p className='mt-2 text-sm text-red-600'>{errMsg}</p>

            <Image
              alt='Sample'
              className='mt-2'
              src={`/files/${sampleDir()}/sample.png`}
              width={800}
            />
          </>
        )}
      </form>
    </div>
  );
}
