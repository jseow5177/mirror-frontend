'use client';

import {
  Campaign,
  CampaignEmail,
  CampaignStatuses,
} from '@/app/_lib/model/campaign';
import { convertUnixToLocalTime } from '@/app/_lib/utils';
import {
  Button,
  Chip,
  Link,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { Progress } from '@nextui-org/react';
import { campaignStatusColors } from '../utils';
import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import EmailHtml from '../email_html';
import { DetailGrid, DetailRow } from '../detail';
import { Segment } from '@/app/_lib/model/segment';

const keyUniqueOpenCount = 'uniqueOpenCount';
const keyTotalLinkClickCount = 'totalLinkClickCount';
const keyRatio = 'ratio';
const keyLinkClickCount = 'linkClickCount';

export default function CampaignView({
  campaign,
  segment,
}: {
  campaign: Campaign;
  segment: Segment;
}) {
  const campaignCreateTime = convertUnixToLocalTime(campaign.create_time);
  const campaignSchedule = convertUnixToLocalTime(campaign.schedule);

  const [emailSortDescriptor, setEmailSortDescriptor] =
    useState<SortDescriptor>({
      column: keyUniqueOpenCount,
      direction: 'descending',
    });

  const sortedEmails = [...campaign.campaign_emails].sort((a, b) => {
    let aValue = 0;
    let bValue = 0;

    switch (emailSortDescriptor.column) {
      case keyUniqueOpenCount:
        aValue = a.campaign_result?.total_unique_open_count || 0;
        bValue = b.campaign_result?.total_unique_open_count || 0;
        break;
      case keyTotalLinkClickCount:
        aValue = a.campaign_result?.total_click_count || 0;
        bValue = b.campaign_result?.total_click_count || 0;
        break;
      case keyRatio:
        aValue = a.ratio;
        bValue = b.ratio;
        break;
      default:
        break;
    }

    if (emailSortDescriptor.direction === 'ascending') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const {
    isOpen: isClickMapOpen,
    onOpen: onClickMapOpen,
    onOpenChange: onClickMapOpenChange,
  } = useDisclosure();

  const {
    isOpen: isLinkClickCountOpen,
    onOpen: onLinkClickCountOpen,
    onOpenChange: onLinkClickCountOpenChange,
  } = useDisclosure();

  const [selectedCampaignEmail, setSelectedCampaignEmail] =
    useState<CampaignEmail>();

  const [selectedClickCountByLinks, setSelectedClickCountByLinks] = useState<
    Record<string, number>
  >({});

  const [linkClickCountSortDescriptor, setLinkClickCountSortDescriptor] =
    useState<SortDescriptor>({
      column: keyLinkClickCount,
      direction: 'descending',
    });

  const sortedLinkClickCount = Object.entries(selectedClickCountByLinks).sort(
    (a, b) => {
      let aValue = 0;
      let bValue = 0;

      switch (linkClickCountSortDescriptor.column) {
        case keyLinkClickCount:
          aValue = a[1] || 0;
          bValue = b[1] || 0;
          break;
        default:
          break;
      }

      if (linkClickCountSortDescriptor.direction === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    }
  );

  return (
    <>
      <DetailGrid>
        <DetailRow label='Name' value={campaign.name} />
        <DetailRow label='Description' value={campaign.campaign_desc} />
        <DetailRow
          label='Status'
          value={
            <Chip color={campaignStatusColors[campaign.status]} size='md'>
              {CampaignStatuses[campaign.status]}
            </Chip>
          }
        />
        <DetailRow
          label='Segment'
          value={
            <Link
              isExternal
              showAnchorIcon
              href={`/dashboard/segments/${campaign.segment_id}`}
            >
              {segment.name}
            </Link>
          }
        />
        <DetailRow label='Emails to be Sent' value={campaign.segment_size} />
        <DetailRow
          label='Progress'
          value={
            <div className='flex-col justify-center'>
              <p className='mb-2'>{campaign.progress}%</p>
              <Progress
                aria-label='Send email progress'
                className='max-w-md'
                color={campaign.progress === 100 ? 'success' : 'primary'}
                size='sm'
                value={campaign.progress}
              />
            </div>
          }
        />
        <DetailRow
          label='Create Time'
          value={`${campaignCreateTime.date}, ${campaignCreateTime.time}`}
        />
        <DetailRow
          label='Schedule'
          value={
            campaign.schedule === 0
              ? `${campaignCreateTime.date}, ${campaignCreateTime.time}`
              : `${campaignSchedule.date}, ${campaignSchedule.time}`
          }
        />
        <DetailRow label='Results' value={''} />
      </DetailGrid>
      <Table
        aria-label='campaign-email-table'
        sortDescriptor={emailSortDescriptor}
        onSortChange={setEmailSortDescriptor}
      >
        <TableHeader>
          <TableColumn>Email</TableColumn>
          <TableColumn>Subject</TableColumn>
          <TableColumn key={keyRatio} allowsSorting>
            Ratio (%)
          </TableColumn>
          <TableColumn key={keyUniqueOpenCount} allowsSorting>
            Unique Open Count
          </TableColumn>
          <TableColumn key={keyTotalLinkClickCount} allowsSorting>
            Total Click Count
          </TableColumn>
          <TableColumn>Average Open Time</TableColumn>
          <TableColumn>Click Map</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No campaign emails to display.'}>
          {sortedEmails.map((campaignEmail, i) => {
            const { date: avgOpenDate, time: avgOpenTime } =
              convertUnixToLocalTime(
                campaignEmail.campaign_result?.avg_open_time || 0
              );

            return (
              <TableRow key={i}>
                <TableCell className='w-[20%]'>
                  <Link
                    isExternal
                    showAnchorIcon
                    href={`/dashboard/emails/${campaignEmail.email_id}`}
                    size='sm'
                  >
                    {campaignEmail.email?.name}
                  </Link>
                </TableCell>
                <TableCell className='w-[20%]'>
                  {campaignEmail.subject}
                </TableCell>
                <TableCell className='w-[5%]'>{campaignEmail.ratio}</TableCell>
                <TableCell className='w-[15%]'>
                  {campaignEmail.campaign_result?.total_unique_open_count}
                </TableCell>
                <TableCell className='w-[15%] flex-col items-center'>
                  <Link
                    href='#'
                    underline='hover'
                    size='sm'
                    onPress={() => {
                      setSelectedClickCountByLinks(
                        campaignEmail.campaign_result?.click_counts_by_link ||
                          {}
                      );
                      onLinkClickCountOpen();
                    }}
                  >
                    {campaignEmail.campaign_result?.total_click_count}
                  </Link>
                </TableCell>
                <TableCell className='w-[20%]'>
                  {campaignEmail.campaign_result?.avg_open_time === 0
                    ? '-'
                    : `${avgOpenDate}, ${avgOpenTime}`}
                </TableCell>
                <TableCell className='w-[5%]'>
                  <Button
                    isIconOnly
                    variant='bordered'
                    onClick={() => {
                      setSelectedCampaignEmail(campaignEmail);
                      onClickMapOpen();
                    }}
                  >
                    <EyeIcon className='h-5' />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Modal
        isOpen={isLinkClickCountOpen}
        onOpenChange={onLinkClickCountOpenChange}
        size='2xl'
        backdrop='blur'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Click Count By Links
              </ModalHeader>
              <ModalBody>
                <Table
                  aria-label='link-count-table'
                  sortDescriptor={linkClickCountSortDescriptor}
                  onSortChange={setLinkClickCountSortDescriptor}
                >
                  <TableHeader>
                    <TableColumn>Link</TableColumn>
                    <TableColumn key={keyLinkClickCount} allowsSorting>
                      Click Count
                    </TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={'No link clicks.'}>
                    {sortedLinkClickCount.map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>
                          <Link isExternal showAnchorIcon href={key}>
                            {key}
                          </Link>
                        </TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={() => {
                    onClose();
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isClickMapOpen}
        onOpenChange={onClickMapOpenChange}
        size='2xl'
        backdrop='blur'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Click Map
              </ModalHeader>
              <ModalBody>
                {selectedCampaignEmail && selectedCampaignEmail.email && (
                  <EmailHtml
                    email={selectedCampaignEmail.email}
                    opts={{
                      clickCounts:
                        selectedCampaignEmail.campaign_result
                          ?.click_counts_by_link || {},
                    }}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
