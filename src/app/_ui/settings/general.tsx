import { Tenant } from '@/app/_lib/model/tenant';
import { User } from '@/app/_lib/model/user';

export default function General({ tenant, me }: { tenant: Tenant; me: User }) {
  return (
    <div className='flex flex-col gap-6'>
      <InfoRow title='Organization'>
        <p>{tenant.name}</p>
      </InfoRow>
      <InfoRow title='Username'>
        <p>{me.username}</p>
      </InfoRow>
    </div>
  );
}

function InfoRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className='mb-2 text-xl font-semibold'>{title}</h2>
      {children}
    </div>
  );
}
