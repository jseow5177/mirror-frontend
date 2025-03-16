'use client';

import { CampaignState, createCampaign } from '@/app/_lib/action/campaign';
import {
  Campaign,
  CampaignEmail,
  CampaignSchema,
  sumRatioEquals100,
} from '@/app/_lib/model/campaign';
import { Email } from '@/app/_lib/model/email';
import {
  useEffect,
  useState,
  useActionState,
  startTransition,
  useRef,
} from 'react';
import NumberCircles from '../number-circle';
import {
  Button,
  Divider,
  Link,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  useDisclosure,
  Input,
  ModalFooter,
  Card,
  Skeleton,
  Textarea,
  CardHeader,
  CardBody,
  ButtonGroup,
  DatePicker,
  Radio,
  RadioGroup,
  Autocomplete,
  AutocompleteItem,
} from '@heroui/react';
import Title from '../title';
import {
  CalendarIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  PercentBadgeIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Segment } from '@/app/_lib/model/segment';
import { countUd } from '@/app/_lib/data/segment';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  parseDateTime,
  ZonedDateTime,
} from '@internationalized/date';
import EmailHtml from '../email-html';

const TOTAL_STEPS = 3;

const CAMPAIGN_START_NOW = 'now';
const CAMPAIGN_START_SCHEDULE = 'schedule';

export default function CampaignForm({
  campaign,
  emails,
  segments,
}: {
  campaign?: Campaign;
  emails: Email[];
  segments: Segment[];
}) {
  let isUpdate = false;
  if (campaign) {
    isUpdate = true;
  }

  const ref = useRef<HTMLFormElement>(null);

  const initialState: CampaignState = {
    message: null,
    fieldErrors: {},
    error: null,
    campaignID: null,
  };

  const isoDateTime = (unix: number): string => {
    const dt = new Date(unix);
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  };

  const toUnix = (
    calendarDate: CalendarDate | CalendarDateTime | ZonedDateTime | null
  ): number => {
    if (!calendarDate) {
      return 0;
    }
    const unix = calendarDate.toDate(getLocalTimeZone());
    return unix.getTime();
  };

  const [campaignFields, setCampaignFields] = useState({
    id: campaign?.id ? campaign?.id : 0,
    name: campaign?.name || '',
    campaign_desc: campaign?.campaign_desc || '',
    emails: campaign?.campaign_emails || [],
    segment_id: campaign?.segment_id ? campaign?.segment_id : 0,
    schedule: campaign?.schedule ? campaign?.schedule : 0,
  });

  const [campaignStartOption, setCampaignStartOption] = useState(
    campaignFields.schedule === 0 ? CAMPAIGN_START_NOW : CAMPAIGN_START_SCHEDULE
  );

  const onCampaignStartOptionChange = (opt: string) => {
    if (opt === CAMPAIGN_START_NOW) {
      setCampaignFields({ ...campaignFields, schedule: 0 });
    } else {
      setCampaignFields({ ...campaignFields, schedule: Date.now() });
    }
    setCampaignStartOption(opt);
  };

  const [currentStep, setCurrentStep] = useState(1);

  const [segmentSize, setSegmentSize] = useState(-1);
  const [isCountLoading, setIsCountLoading] = useState(false);

  const useDebouncedCount = (segmentID: number, delay = 500) => {
    useEffect(() => {
      if (isNaN(segmentID) || segmentID === 0) return;

      const debounce = setTimeout(async () => {
        try {
          setIsCountLoading(true);
          const [count] = await Promise.all([
            countUd(segmentID),
            new Promise((r) => setTimeout(r, 300)),
          ]);
          setSegmentSize(count);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : String(error));
        } finally {
          setIsCountLoading(false);
        }
      }, delay);

      return () => {
        clearTimeout(debounce);
        setIsCountLoading(false);
      };
    }, [segmentID, delay]);
  };

  useDebouncedCount(Number(campaignFields.segment_id));

  const [searchTerm, setSearchTerm] = useState('');

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleCreateCampaign = (s: CampaignState, formData: FormData) => {
    formData.append('emails', JSON.stringify(campaignFields.emails));
    formData.append('segment_id', `${campaignFields.segment_id}`);
    formData.append('schedule', `${campaignFields.schedule}`);
    return createCampaign(s, formData);
  };

  const [state, formAction, pending] = useActionState(
    handleCreateCampaign,
    initialState
  );

  useEffect(() => {
    if (state.fieldErrors) {
      return;
    }

    if (state.error) {
      toast.error(state.error ? state.error : 'Error encountered');
    } else {
      if (state.message) {
        toast.success(state.message);
      }
      redirect('/dashboard/campaigns');
    }
  }, [state]);

  const atLastStep = currentStep === TOTAL_STEPS;

  const nextStep = (newStep?: number) => {
    let hasError = false;

    switch (currentStep) {
      case 1:
        const segmentField = CampaignSchema.pick({
          segment_id: true,
        }).safeParse(campaignFields);

        if (!segmentField.success) {
          toast.error(segmentField.error.flatten().fieldErrors.segment_id![0]);
          hasError = true;
        }

        break;
      case 2:
        const emailField = CampaignSchema.pick({ emails: true })
          .refine(sumRatioEquals100, {
            message: 'Ratio must add to 100%',
            path: ['emails'],
          })
          .safeParse(campaignFields);

        if (!emailField.success) {
          toast.error(emailField.error.flatten().fieldErrors.emails![0]);
          hasError = true;
        }

        break;
      default:
    }

    if (!hasError) {
      if (newStep) {
        setCurrentStep(newStep);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const previousStep = () => {
    if (currentStep === 1) {
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  const onSegmentChange = (e: string | number | null) => {
    if (!e) {
      return;
    }

    setCampaignFields({ ...campaignFields, segment_id: Number(e) });
  };

  const renderFirstFormPage = () => {
    return (
      <>
        <Title title='Select a Segment' />
        <Autocomplete
          className='mb-4 w-[40%]'
          aria-label='Segment'
          placeholder='Segment'
          variant='bordered'
          selectedKey={`${campaignFields.segment_id}`}
          onSelectionChange={onSegmentChange}
        >
          {segments.map((segment) => (
            <AutocompleteItem key={segment.id!}>
              {segment.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <Skeleton
          isLoaded={!isCountLoading}
          className='w-[10%] rounded-lg text-lg'
        >
          <p>Size: {segmentSize === -1 ? '-' : segmentSize}</p>
        </Skeleton>
      </>
    );
  };

  const findEmail = (emailID: number) =>
    emails.find((email) => email.id === emailID);

  const onSelectEmail = (emailID: number) => {
    setCampaignFields({
      ...campaignFields,
      emails: [
        ...campaignFields.emails,
        {
          email_id: emailID,
          subject: '',
          ratio: 0,
        },
      ],
    });
    onClose();
  };

  const atEmailLimit = () => {
    return campaignFields.emails.length === 4;
  };

  const deleteEmail = (index: number) => {
    setCampaignFields({
      ...campaignFields,
      emails: [
        ...campaignFields.emails.slice(0, index),
        ...campaignFields.emails.slice(index + 1),
      ],
    });
  };

  const copyEmail = (index: number) => {
    setCampaignFields({
      ...campaignFields,
      emails: [
        ...campaignFields.emails.slice(0, index + 1),
        {
          ...campaignFields.emails[index],
        },
        ...campaignFields.emails.slice(index + 1),
      ],
    });
  };

  const onEmailChange = (
    index: number,
    key: keyof CampaignEmail,
    value: string
  ) => {
    const updatedCampaignEmails = campaignFields.emails.map((email, i) => {
      if (i === index) {
        return { ...email, [key]: value };
      }
      return email;
    });

    setCampaignFields({
      ...campaignFields,
      emails: updatedCampaignEmails,
    });
  };

  const renderSecondFormPage = () => {
    return (
      <>
        <Button
          type='button'
          color='primary'
          variant='bordered'
          onPress={onOpen}
          startContent={<PlusIcon color='#006FEE' className='w-4' />}
          isDisabled={atEmailLimit()}
          className='mb-6'
        >
          Add Email
        </Button>

        {campaignFields.emails.length > 0 && (
          <div className='mb-6 grid grid-cols-2 gap-4'>
            {campaignFields.emails.map((email, index) => {
              return (
                <Card className='w-full' key={index}>
                  <CardHeader className='flex justify-between'>
                    <p className='text-lg'>{findEmail(email.email_id)?.name}</p>
                    <ButtonGroup variant='light' size='sm' className='gap-2'>
                      <Button
                        isIconOnly
                        color='default'
                        aria-label='copy'
                        isDisabled={atEmailLimit()}
                        onPress={() => copyEmail(index)}
                      >
                        <DocumentDuplicateIcon />
                      </Button>
                      <Button
                        isIconOnly
                        aria-label='delete'
                        color='danger'
                        onPress={() => deleteEmail(index)}
                      >
                        <TrashIcon />
                      </Button>
                    </ButtonGroup>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {/* Email subject */}
                    <Input
                      className='mb-6 w-full'
                      id={`subject-${index}`}
                      name='subject'
                      variant='bordered'
                      label={
                        <div className='flex gap-2'>
                          <TagIcon className='w-5' />
                          <p>Email Subject</p>
                        </div>
                      }
                      labelPlacement='inside'
                      fullWidth={false}
                      value={email.subject}
                      onValueChange={(v) => onEmailChange(index, 'subject', v)}
                    />

                    {/* Ratio */}
                    <Input
                      className='mb-6 w-[30%]'
                      id={`ratio-${index}`}
                      name='ratio'
                      variant='bordered'
                      label={
                        <div className='flex gap-2'>
                          <PercentBadgeIcon className='w-5' />
                          <p>Ratio</p>
                        </div>
                      }
                      labelPlacement='inside'
                      fullWidth={false}
                      value={`${email.ratio}`}
                      onValueChange={(v) => onEmailChange(index, 'ratio', v)}
                      type='number'
                      endContent='%'
                    />
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        <Modal
          size='5xl'
          className='h-[90%]'
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior='inside'
        >
          <ModalContent>
            <ModalHeader className='flex-col gap-2'>
              <h1 className='text-xl'>Select an Email</h1>
              <Input
                id='keyword'
                name='keyword'
                variant='bordered'
                className='w-[80%]'
                size='md'
                placeholder='Search by name or description...'
                value={searchTerm}
                onValueChange={(v) => setSearchTerm(v.toLowerCase())}
                onClear={() => setSearchTerm('')}
                isClearable
              />
            </ModalHeader>
            <ModalBody>
              <div className='grid grid-cols-2 gap-4'>
                {emails
                  .filter(
                    (email) =>
                      email.name.toLowerCase().indexOf(searchTerm) > -1 ||
                      email.email_desc.toLowerCase().indexOf(searchTerm) > -1
                  )
                  .map((email, index) => {
                    return (
                      <Card
                        key={index}
                        radius='lg'
                        shadow='none'
                        className='group relative flex flex-col border p-2'
                        style={{ height: '300px' }} // Fixed height for each card
                      >
                        <div className='relative flex-1 overflow-hidden'>
                          <div
                            className='h-full transition-all group-hover:blur-sm'
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <div
                              style={{
                                transform: 'scale(0.95)', // Scales down HTML content
                                transformOrigin: 'top center',
                                maxHeight: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                              }}
                            >
                              <EmailHtml email={email} />
                            </div>
                          </div>
                          <div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-4 bg-opacity-50 opacity-0 transition-all group-hover:pointer-events-auto group-hover:opacity-100'>
                            <Button
                              color='secondary'
                              size='md'
                              as={Link}
                              target='_blank'
                              href={`/dashboard/emails/${email.id}`}
                            >
                              View
                            </Button>
                            <Button
                              color='primary'
                              size='md'
                              onPress={() => onSelectEmail(email.id!)}
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };

  const renderThirdFormPage = () => {
    return (
      <>
        <Title title='Basic Info' />

        {/* Campaign ID */}
        {isUpdate && (
          <Input
            className='hidden'
            id='id'
            name='id'
            value={`${campaignFields.id}`}
          />
        )}

        {/* Campaign Name */}
        <Input
          className='mb-6 w-1/2'
          id='name'
          aria-label='name'
          name='name'
          variant='bordered'
          label={
            <div className='flex gap-2'>
              <TagIcon className='w-5' />
              <p>Name</p>
            </div>
          }
          labelPlacement='inside'
          fullWidth={false}
          value={campaignFields.name}
          isInvalid={state.fieldErrors?.name && true}
          errorMessage={state.fieldErrors?.name && state.fieldErrors?.name[0]}
          onValueChange={(v) =>
            setCampaignFields({
              ...campaignFields,
              name: v,
            })
          }
        />

        {/* Campaign Description */}
        <Textarea
          className='mb-6 w-1/2'
          id='campaign_desc'
          aria-label='campaign_desc'
          name='campaign_desc'
          variant='bordered'
          label={
            <div className='flex gap-2'>
              <DocumentTextIcon className='w-5' />
              <p className='text-lg'>Description</p>
            </div>
          }
          labelPlacement='inside'
          fullWidth={false}
          value={campaignFields.campaign_desc}
          isInvalid={state.fieldErrors?.campaign_desc && true}
          errorMessage={
            state.fieldErrors?.campaign_desc &&
            state.fieldErrors?.campaign_desc[0]
          }
          onValueChange={(v) =>
            setCampaignFields({
              ...campaignFields,
              campaign_desc: v,
            })
          }
        />

        {/* Campaign Start Option */}
        <RadioGroup
          orientation='horizontal'
          className='mb-6'
          value={campaignStartOption}
          onValueChange={onCampaignStartOptionChange}
          label={
            <div className='flex gap-2'>
              <CalendarIcon className='w-5' />
              <p className='text-lg'>Start Option</p>
            </div>
          }
        >
          <Radio value={CAMPAIGN_START_NOW}>Now</Radio>
          <Radio value={CAMPAIGN_START_SCHEDULE}>Schedule</Radio>
        </RadioGroup>

        {/* Date Picker */}
        {campaignStartOption !== CAMPAIGN_START_NOW && (
          <>
            <DatePicker
              aria-label='datetime'
              variant='bordered'
              className='w-1/2'
              hideTimeZone
              showMonthAndYearPickers
              value={parseDateTime(
                isoDateTime(Number(campaignFields.schedule))
              )}
              onChange={(v) => {
                setCampaignFields({
                  ...campaignFields,
                  schedule: toUnix(v),
                });
              }}
              label={
                <div className='flex gap-2'>
                  <ClockIcon className='w-5' />
                  <p className='text-lg'>Datetime</p>
                </div>
              }
            />
          </>
        )}
      </>
    );
  };

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return renderFirstFormPage();
      case 2:
        return renderSecondFormPage();
      case 3:
        return renderThirdFormPage();
      default:
        return <div></div>;
    }
  };

  return (
    <div className='flex w-full flex-col items-center'>
      <form ref={ref} className='w-[90%] rounded-md'>
        <div className='flex w-full items-center justify-between'>
          <NumberCircles
            totalSteps={TOTAL_STEPS}
            currentStep={currentStep}
            onPress={(s) => nextStep(s)}
          />
          <div className='flex items-center gap-4'>
            <Button
              href='/dashboard/campaigns'
              as={Link}
              isDisabled={pending}
              color='danger'
              variant='light'
            >
              Cancel
            </Button>
            <Button
              isDisabled={pending || currentStep == 1}
              color='default'
              variant='solid'
              onPress={() => {
                previousStep();
              }}
            >
              Previous
            </Button>
            {atLastStep ? (
              <Button
                onPress={() => {
                  if (ref.current) {
                    startTransition(() =>
                      formAction(new FormData(ref.current!))
                    );
                  }
                }}
                isDisabled={pending}
                isLoading={pending}
                color='success'
                variant='solid'
              >
                Save
              </Button>
            ) : (
              <Button
                type='button'
                isDisabled={pending || isCountLoading}
                color='primary'
                variant='solid'
                onClick={(e) => {
                  // TODO: This button click triggers submit at last step
                  // Could be due to event propagate during render
                  e.preventDefault();
                  nextStep();
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        <Divider className='my-10' />

        {renderForm()}
      </form>
    </div>
  );
}
