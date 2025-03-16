'use client';

import { Email } from '@/app/_lib/model/email';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import EmailHtml from '../email-html';
import { DetailGrid, DetailRow } from '../detail';
import { Button, Link } from '@heroui/react';

export default function EmailView({ email }: { email: Email }) {
  const emailCreateTime = convertUnixToLocalTime(email.create_time);
  const emailUpdateTime = convertUnixToLocalTime(email.update_time);

  return (
    <div className='flex justify-between'>
      <div>
        <DetailGrid>
          <DetailRow label='Name' value={email.name} />
          <DetailRow label='Description' value={email.email_desc} />
          <DetailRow
            label='Create Time'
            value={`${emailCreateTime.date}, ${emailCreateTime.time}`}
          />
          <DetailRow
            label='Update Time'
            value={`${emailUpdateTime.date}, ${emailUpdateTime.time}`}
          />
          <DetailRow label='Email' value={''} />
        </DetailGrid>
        <EmailHtml email={email} />
      </div>
      <Button
        color='primary'
        as={Link}
        href={`/dashboard/emails/${email.id}/update`}
      >
        Edit Email
      </Button>
    </div>
  );
}
