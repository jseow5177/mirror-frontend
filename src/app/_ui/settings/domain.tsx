import { Tenant } from '@/app/_lib/model/tenant';
import {
  Alert,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Snippet,
} from '@heroui/react';
import { VerifyDomain, CreateDomain } from './buttons';

export default function Domain({ tenant }: { tenant: Tenant }) {
  const recordTypes: string[] = ['type', 'host_name', 'value'];
  const recordLabels: Record<string, string> = {
    type: 'Type',
    host_name: 'Host Name',
    value: 'Value',
  };

  const dnsRecordLabels: Record<string, string> = {
    brevo_code: 'Brevo Code',
    dkim1Record: 'DKIM 1 Record',
    dkim2Record: 'DKIM 2 Record',
    dmarc_record: 'DMARC Record',
  };

  return (
    <>
      <div className='mb-4'>
        <h2 className='mb-4 mt-6 text-xl font-bold'>Domain</h2>
        <p>
          An email domain is the part that comes after the @ symbol. For better
          deliverability, the domain must be verified.
        </p>
      </div>

      {!tenant.ext_info.domain ? (
        <Alert
          color='danger'
          title='You do not have a registered domain.'
          endContent={<CreateDomain />}
        />
      ) : (
        <>
          <div className='mb-4'>
            {tenant.ext_info.is_domain_valid ? (
              <Alert color='success' title='Your domain is verified.' />
            ) : (
              <Alert
                color='danger'
                title='Your domain is not verified.'
                className='items-center'
                description={
                  <div className='mt-1'>
                    <p>
                      Copy the values of the Brevo code, DKIM, and DMARC records
                      to your domain provider account.
                    </p>
                    <p>Any changes may take up to 48 hours to take effect.</p>
                  </div>
                }
                endContent={<VerifyDomain />}
              />
            )}
          </div>

          <div className='flex items-center gap-2'>
            <p>Domain name:</p>
            <Snippet size='md' className='h-12' hideSymbol>
              {tenant.ext_info.domain}
            </Snippet>
          </div>

          <h2 className='mb-4 mt-6 text-xl font-bold'>DNS Records</h2>
          <div className='flex flex-col gap-6'>
            {Object.entries(tenant.ext_info.dns_records).map(
              ([key, records]) =>
                records ? (
                  <Card key={key} shadow='sm' className='w-[60%]'>
                    <CardHeader className='font-semibold'>
                      {dnsRecordLabels[key]}
                    </CardHeader>
                    <CardBody>
                      <div className='flex flex-col gap-5'>
                        {recordTypes
                          .filter((recordType) => recordType in records)
                          .map((recordType) => (
                            <div
                              key={`${key}-${recordType}`}
                              className='flex items-center'
                            >
                              <p className='w-[200px]'>
                                {recordLabels[recordType]}
                              </p>
                              <Snippet
                                size='md'
                                className='h-12'
                                hideSymbol
                                fullWidth
                                hideCopyButton={
                                  recordType === 'type' ||
                                  records[recordType] === 'NA'
                                }
                              >
                                {records[recordType] === 'NA'
                                  ? '(Leave it blank)'
                                  : records[recordType]}
                              </Snippet>
                            </div>
                          ))}
                      </div>
                    </CardBody>
                    <CardFooter>
                      {!tenant.ext_info.is_domain_valid && (
                        <Alert
                          title={`This record ${records['status'] ? 'matches' : 'does not match'} your domain provider account.`}
                          color={records['status'] ? 'success' : 'danger'}
                        />
                      )}
                    </CardFooter>
                  </Card>
                ) : null
            )}
          </div>
        </>
      )}
    </>
  );
}
