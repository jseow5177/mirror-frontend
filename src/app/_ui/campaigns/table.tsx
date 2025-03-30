'use client';

import { Campaign, CampaignStatuses } from '@/app/_lib/model/campaign';
import { campaignStatusColors } from '../utils';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import { CampaignActions } from './buttons';

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
      <TableBody emptyContent='You have no campaigns.'>
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
                <Chip color={campaignStatusColors[campaign.status]}>
                  {CampaignStatuses[campaign.status]}
                </Chip>
              </TableCell>
              <TableCell className='w-[15%]'>
                <p>{createDate}</p>
                <p className='mt-2 text-xs'>{createTime}</p>
              </TableCell>
              <TableCell className='w-[15%]'>
                <p>{updateDate}</p>
                <p className='mt-2 text-xs'>{updateTime}</p>
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
