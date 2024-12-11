'use client';

import {
  Campaign,
  CampaignStatus,
  CampaignStatuses,
} from '@/app/lib/model/campaign';
import { ChipColors } from '../utils';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { convertUnixToLocalTime } from '@/app/lib/utils';
import { CampaignActions } from './buttons';

const statusColors: Record<CampaignStatus, ChipColors> = {
  [CampaignStatus.Pending]: 'default',
  [CampaignStatus.Running]: 'success',
  [CampaignStatus.Failed]: 'danger',
};

export default function CampaignTable({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  return (
    <Table aria-label='campaign-table'>
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Description</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Create Time</TableColumn>
        <TableColumn>Update Time</TableColumn>
        <TableColumn> </TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No campaigns to display.'}>
        {campaigns.map((campaign, i) => {
          const { date: updateDate, time: updateTime } = convertUnixToLocalTime(
            campaign.update_time
          );
          const { date: createDate, time: createTime } = convertUnixToLocalTime(
            campaign.create_time
          );
          return (
            <TableRow key={i}>
              <TableCell className='w-[20%]'>{campaign.name}</TableCell>
              <TableCell className='w-[30%]'>
                {campaign.campaign_desc}
              </TableCell>
              <TableCell className='w-[10%]'>
                <Chip color={statusColors[campaign.status]}>
                  {CampaignStatuses[campaign.status]}
                </Chip>
              </TableCell>
              <TableCell className='w-[15%]'>
                <p>{createDate}</p>
                <p className='mt-1 text-xs'>{createTime}</p>
              </TableCell>
              <TableCell className='w-[15%]'>
                <p>{updateDate}</p>
                <p className='mt-1 text-xs'>{updateTime}</p>
              </TableCell>
              <TableCell className='w-[10%]'>
                <CampaignActions campaign={campaign} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
