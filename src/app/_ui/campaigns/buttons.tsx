import { Campaign } from '@/app/_lib/model/campaign';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button, ButtonGroup } from '@nextui-org/react';
import Link from 'next/link';

export function CreateCampaign() {
  return (
    <Button
      href='/dashboard/campaigns/create'
      as={Link}
      color='primary'
      variant='solid'
      startContent={<PlusIcon className='h-8' />}
    >
      Create Campaign
    </Button>
  );
}

export function ViewCampaign({ id }: { id: number }) {
  return (
    <Button
      isIconOnly
      variant='bordered'
      as={Link}
      href={`/dashboard/campaigns/${id}`}
    >
      <EyeIcon className='h-5' />
    </Button>
  );
}

export function CampaignActions({ campaign }: { campaign: Campaign }) {
  return (
    <ButtonGroup>
      <ViewCampaign id={campaign.id || 0} />
    </ButtonGroup>
  );
}
