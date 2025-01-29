'use client';

import { Email } from '@/app/_lib/model/email';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import EmailHtml from '../email_html';

export default function EmailView({ email }: { email: Email }) {
  const emailCreateTime = convertUnixToLocalTime(email.create_time);
  const emailUpdateTime = convertUnixToLocalTime(email.update_time);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '200px auto',
          rowGap: '16px',
          marginBottom: '16px',
        }}
      >
        <p>
          <strong>Name:</strong>
        </p>
        <p>{email.name}</p>

        <p>
          <strong>Description:</strong>
        </p>
        <p>{email.email_desc}</p>

        <p>
          <strong>Create Time:</strong>
        </p>
        <p>
          {emailCreateTime.date}, {emailCreateTime.time}
        </p>

        <p>
          <strong>Update Time:</strong>
        </p>
        <p>
          {emailUpdateTime.date}, {emailUpdateTime.time}
        </p>

        <p>
          <strong>Email:</strong>
        </p>
      </div>
      <EmailHtml email={email} />
    </div>
  );
}
