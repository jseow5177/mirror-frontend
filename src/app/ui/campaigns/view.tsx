'use client';

import {
  Campaign,
  CampaignEmail,
  CampaignStatuses,
} from '@/app/lib/model/campaign';
import { convertUnixToLocalTime } from '@/app/lib/utils';
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

const keyUniqueOpenCount = 'uniqueOpenCount';
const keyTotalLinkClickCount = 'totalLinkClickCount';
const keyRatio = 'ratio';
const keyLinkClickCount = 'linkClickCount';

export default function CampaignView({ campaign }: { campaign: Campaign }) {
  const campaignCreateTime = convertUnixToLocalTime(campaign.create_time);
  const campaignSchedule = convertUnixToLocalTime(campaign.schedule);

  const progress = Math.round(
    campaign.segment_size > 0
      ? (campaign.progress * 100) / campaign.segment_size
      : 0
  );

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
        <p>{campaign.name}</p>

        <p>
          <strong>Description:</strong>
        </p>
        <p>{campaign.campaign_desc}</p>

        <p>
          <strong>Status:</strong>
        </p>
        <Chip color={campaignStatusColors[campaign.status]} size='md'>
          {CampaignStatuses[campaign.status]}
        </Chip>

        <p>
          <strong>Segment:</strong>
        </p>
        <p>
          <Link
            isExternal
            showAnchorIcon
            href={`/dashboard/segments/${campaign.segment_id}`}
          >
            {campaign.segment?.name}
          </Link>
        </p>

        <p>
          <strong>Emails to be Sent:</strong>
        </p>
        <p>{campaign.segment_size}</p>

        <p>
          <strong>Progress:</strong>
        </p>
        <div className='flex-col justify-center'>
          <p className='mb-2'>
            {campaign.progress} ({progress}%)
          </p>
          <Progress
            aria-label='Send email progress'
            className='max-w-md'
            color={progress === 100 ? 'success' : 'primary'}
            size='sm'
            value={progress}
          />
        </div>

        <p>
          <strong>Create Time:</strong>
        </p>
        <p>
          {campaignCreateTime.date}, {campaignCreateTime.time}
        </p>

        <p>
          <strong>Schedule:</strong>
        </p>
        <p>
          {campaign.schedule === 0
            ? `${campaignCreateTime.date}, ${campaignCreateTime.time}`
            : `${campaignSchedule.date}, ${campaignSchedule.time}`}
        </p>

        <p>
          <strong>Results:</strong>
        </p>
        <p></p>
      </div>

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
    </div>
  );
}
