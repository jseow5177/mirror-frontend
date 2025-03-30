'use client';

import { Sender as SenderModel, Tenant } from '@/app/_lib/model/tenant';
import {
  Alert,
  Snippet,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { CreateSender } from './buttons';

export default function Sender({
  tenant,
  senders,
}: {
  tenant: Tenant;
  senders: SenderModel[];
}) {
  const canCreateSender = () => {
    return tenant.ext_info.domain && tenant.ext_info.is_domain_valid;
  };

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='mb-4 mt-6 text-xl font-bold'>Sender</h2>
          <p>
            A sender is the name and email address used to send your emails. For
            better deliverability, the domain must be verified.
          </p>
        </div>
        {canCreateSender() && <CreateSender tenant={tenant} />}
      </div>

      {!canCreateSender() ? (
        <Alert
          color='danger'
          title='You do not have a verified domain.'
          description={
            <div className='mt-1'>
              <p>Go to the Domain tab to create and verify a domain.</p>
            </div>
          }
        />
      ) : (
        <div className='w-[60%]'>
          <Table fullWidth aria-label='senders table'>
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
            </TableHeader>
            <TableBody emptyContent='You have no senders.'>
              {senders.map((sender, i) => (
                <TableRow key={i}>
                  <TableCell>{sender.name}</TableCell>
                  <TableCell>
                    <Snippet size='md' hideSymbol fullWidth>
                      {sender.email}
                    </Snippet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
