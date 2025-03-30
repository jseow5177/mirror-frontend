'use client';

import { Tab, Tabs } from '@heroui/react';
import Domain from './domain';
import { Sender as SenderModel, Tenant } from '@/app/_lib/model/tenant';
import Sender from './sender';

export default function EmailSetting({
  tenant,
  senders,
}: {
  tenant: Tenant;
  senders: SenderModel[];
}) {
  return (
    <Tabs
      aria-label='email settings'
      variant='bordered'
      color='primary'
      size='lg'
    >
      <Tab key='domain' title='Domain'>
        <Domain tenant={tenant} />
      </Tab>
      <Tab key='sender' title='Sender'>
        <Sender tenant={tenant} senders={senders} />
      </Tab>
    </Tabs>
  );
}
