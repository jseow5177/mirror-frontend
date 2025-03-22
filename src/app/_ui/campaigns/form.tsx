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
  useDisclosure,
  Input,
  Card,
  Skeleton,
  Textarea,
  CardHeader,
  CardBody,
  DatePicker,
  Radio,
  RadioGroup,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
  RadioProps,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  CardFooter,
  Chip,
  Slider,
} from '@heroui/react';
import Title from '../title';
import {
  Bars3Icon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  PuzzlePieceIcon,
  TagIcon,
  UserGroupIcon,
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
import clsx from 'clsx';

const TOTAL_STEPS = 2;

const CAMPAIGN_START_NOW = 'now';
const CAMPAIGN_START_SCHEDULE = 'schedule';

const CAMPAIGN_TYPE_REGULAR = 'regular';
const CAMPAIGN_TYPE_AB = 'ab';

const STARTING_REGULAR_EMAIL = {
  email_id: 0,
  subject: '',
  ratio: 100,
};

const STARTING_AB_EMAIL = {
  ...STARTING_REGULAR_EMAIL,
  ratio: 50,
};

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

  const [campaignType, setCampaignType] = useState(CAMPAIGN_TYPE_REGULAR);

  const getStartingEmails = (campaignType: string) => {
    if (campaignType === CAMPAIGN_TYPE_AB) {
      return [STARTING_AB_EMAIL, STARTING_AB_EMAIL];
    } else if (campaignType === CAMPAIGN_TYPE_REGULAR) {
      return [STARTING_REGULAR_EMAIL];
    }
    return [];
  };

  const [campaignFields, setCampaignFields] = useState({
    id: campaign?.id ? campaign?.id : 0,
    name: campaign?.name || '',
    campaign_desc: campaign?.campaign_desc || '',
    emails: campaign?.campaign_emails || getStartingEmails(campaignType),
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

  const handleCreateCampaign = (s: CampaignState, formData: FormData) => {
    formData.append('emails', JSON.stringify(campaignFields.emails));
    formData.append('segment_id', `${campaignFields.segment_id}`);
    formData.append('schedule', `${campaignFields.schedule}`);
    formData.append('name', campaignFields.name);
    formData.append('campaign_desc', campaignFields.campaign_desc);
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

  const [basicInfoErrors, setBasicInfoErrors] = useState<{
    name?: string[] | undefined;
    campaign_desc?: string[] | undefined;
    segment_id?: string[] | undefined;
  }>();

  const nextStep = (newStep?: number) => {
    let hasError = false;

    switch (currentStep) {
      case 1:
        setBasicInfoErrors({});

        const basicInfoFields = CampaignSchema.pick({
          name: true,
          campaign_desc: true,
          segment_id: true,
        }).safeParse(campaignFields);

        if (!basicInfoFields.success) {
          setBasicInfoErrors(basicInfoFields.error.flatten().fieldErrors);
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

  const findEmail = (emailID: number) =>
    emails.find((email) => email.id === emailID);

  const onEmailChange = (
    index: number,
    key: keyof CampaignEmail,
    value: string | number
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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState('');

  const [activeEmailSelection, setActiveEmailSelection] = useState(0);

  const openEmailDrawer = (i: number) => {
    setActiveEmailSelection(i);
    onOpen();
  };

  const handleRatioChange = (i: number, v: number) => {
    const newRatio = v * 100;
    const remainEmailCount = campaignFields.emails.length - 1;

    if (remainEmailCount === 0) {
      onEmailChange(i, 'ratio', newRatio);
      return;
    }

    const newEmails = [];
    const ratioChange = newRatio - campaignFields.emails[i].ratio;
    const ratioChangePerRemainEmail = ratioChange / remainEmailCount;

    for (let j = 0; j < campaignFields.emails.length; j++) {
      if (j === i) {
        newEmails.push({
          ...campaignFields.emails[j],
          ratio: newRatio,
        });
      } else {
        const adjustedRatio =
          campaignFields.emails[j].ratio - ratioChangePerRemainEmail;
        newEmails.push({
          ...campaignFields.emails[j],
          ratio: adjustedRatio,
        });
      }
    }

    setCampaignFields({
      ...campaignFields,
      emails: newEmails,
    });
  };

  const renderRegularCampaignForm = () => {
    const emailErrors = state?.fieldErrors?.emails || [];
    return (
      <div className='w-[50%]'>
        <Title title='Email Info' />

        {/* Email Subject */}
        <Input
          className='mb-6'
          id='subject'
          name='subject'
          variant='bordered'
          label={
            <div className='flex gap-2'>
              <Bars3Icon className='w-5' />
              <p>Subject</p>
            </div>
          }
          labelPlacement='inside'
          value={campaignFields.emails[0].subject}
          onValueChange={(v) => onEmailChange(0, 'subject', v)}
          isInvalid={emailErrors.length > 0 && emailErrors[0].subject && true}
          errorMessage={emailErrors.length > 0 && emailErrors[0].subject}
        />

        {/* Email */}
        <div className='mb-6 flex items-start gap-2'>
          <Input
            id='email'
            name='email'
            variant='bordered'
            label={
              <div className='flex gap-2'>
                <EnvelopeIcon className='w-5' />
                <p>Email</p>
              </div>
            }
            labelPlacement='inside'
            value={findEmail(campaignFields.emails[0].email_id)?.name || ''}
            isReadOnly
            isInvalid={
              emailErrors.length > 0 && emailErrors[0].email_id && true
            }
            errorMessage={emailErrors.length > 0 && emailErrors[0].email_id}
          />
          <Button
            size='md'
            color='primary'
            variant='ghost'
            onPress={() => openEmailDrawer(0)}
          >
            Select Email
          </Button>
        </div>
      </div>
    );
  };

  const renderABChip = (i: number) => {
    if (i === 0) {
      return <Chip color='primary'>Control Group</Chip>;
    } else {
      return <Chip color='default'>Test Group</Chip>;
    }
  };

  const renderABCampaignForm = () => {
    const emailErrors = state?.fieldErrors?.emails || [];
    return (
      <div className='flex w-[100%] gap-8'>
        {campaignFields.emails.map((email, i) => {
          return (
            <Card key={i} shadow='sm' fullWidth>
              <CardHeader>{renderABChip(i)}</CardHeader>

              <CardBody>
                <Input
                  className='mb-6'
                  id={`subject-${i}`}
                  name='subject'
                  variant='bordered'
                  label={
                    <div className='flex gap-2'>
                      <Bars3Icon className='w-5' />
                      <p>Subject</p>
                    </div>
                  }
                  labelPlacement='inside'
                  value={email.subject}
                  onValueChange={(v) => onEmailChange(i, 'subject', v)}
                  isInvalid={emailErrors[i] && emailErrors[i].subject && true}
                  errorMessage={emailErrors[i] && emailErrors[i].subject}
                />

                <div className='mb-6 flex items-start gap-2'>
                  <Input
                    id={`email-${i}`}
                    name='email'
                    variant='bordered'
                    label={
                      <div className='flex gap-2'>
                        <EnvelopeIcon className='w-5' />
                        <p>Email</p>
                      </div>
                    }
                    labelPlacement='inside'
                    value={
                      findEmail(campaignFields.emails[i].email_id)?.name || ''
                    }
                    isReadOnly
                    isInvalid={
                      emailErrors[i] && emailErrors[i].email_id && true
                    }
                    errorMessage={emailErrors[i] && emailErrors[i].email_id}
                  />
                  <Button
                    size='md'
                    color='primary'
                    variant='ghost'
                    onPress={() => openEmailDrawer(i)}
                    className='w-fit'
                  >
                    Select Email
                  </Button>
                </div>

                <Slider
                  label={
                    <div className='flex gap-2'>
                      <p>Traffic Split</p>
                      <Tooltip
                        showArrow
                        color='foreground'
                        content='Divides users between test variations.'
                        placement='right'
                      >
                        <InformationCircleIcon className='w-4' />
                      </Tooltip>
                    </div>
                  }
                  size='sm'
                  step={0.05}
                  showSteps
                  formatOptions={{ style: 'percent' }}
                  value={campaignFields.emails[i].ratio / 100}
                  minValue={0.05}
                  maxValue={0.95}
                  marks={[
                    {
                      value: 0.2,
                      label: '20%',
                    },
                    {
                      value: 0.5,
                      label: '50%',
                    },
                    {
                      value: 0.8,
                      label: '80%',
                    },
                  ]}
                  onChange={(v) => handleRatioChange(i, v as number)}
                />
              </CardBody>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderSecondFormPage = () => {
    switch (campaignType) {
      case CAMPAIGN_TYPE_REGULAR:
        return renderRegularCampaignForm();
      case CAMPAIGN_TYPE_AB:
        return renderABCampaignForm();
      default:
        return <></>;
    }
  };

  const handleCampaignTypeChange = (v: string) => {
    setCampaignFields({
      ...campaignFields,
      emails: getStartingEmails(v),
    });
    setCampaignType(v);
  };

  const renderFirstFormPage = () => {
    return (
      <div className='w-[50%]'>
        <Title title='Basic Info' />

        <div className='flex flex-col gap-6'>
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
            isInvalid={basicInfoErrors?.name && true}
            errorMessage={basicInfoErrors?.name && basicInfoErrors?.name[0]}
            onValueChange={(v) =>
              setCampaignFields({
                ...campaignFields,
                name: v,
              })
            }
          />

          {/* Campaign Description */}
          <Textarea
            id='campaign_desc'
            aria-label='campaign_desc'
            name='campaign_desc'
            variant='bordered'
            label={
              <div className='flex gap-2'>
                <DocumentTextIcon className='w-5' />
                <p>Description</p>
              </div>
            }
            labelPlacement='inside'
            fullWidth={false}
            value={campaignFields.campaign_desc}
            isInvalid={basicInfoErrors?.campaign_desc && true}
            errorMessage={
              basicInfoErrors?.campaign_desc &&
              basicInfoErrors?.campaign_desc[0]
            }
            onValueChange={(v) =>
              setCampaignFields({
                ...campaignFields,
                campaign_desc: v,
              })
            }
          />

          {/* Segment */}
          <Autocomplete
            aria-label='Segment'
            variant='bordered'
            selectedKey={`${campaignFields.segment_id}`}
            onSelectionChange={onSegmentChange}
            label={
              <div className='flex gap-2'>
                <UserGroupIcon className='w-5' />
                <p>Segment</p>
              </div>
            }
            isInvalid={basicInfoErrors?.segment_id && true}
            errorMessage={
              basicInfoErrors?.segment_id && basicInfoErrors?.segment_id[0]
            }
          >
            {segments.map((segment) => (
              <AutocompleteItem key={segment.id!}>
                {segment.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          {/* Campaign Type */}
          <RadioGroup
            orientation='horizontal'
            value={campaignType}
            onValueChange={(v) => {
              handleCampaignTypeChange(v);
            }}
            label={
              <div className='flex gap-2'>
                <PuzzlePieceIcon className='w-5' />
                <p>Campaign Type</p>
              </div>
            }
          >
            <CardRadio
              description='Send an email to a segment'
              value={CAMPAIGN_TYPE_REGULAR}
            >
              Regular
            </CardRadio>
            <CardRadio
              description='Send two or more versions of an email to a segment'
              value={CAMPAIGN_TYPE_AB}
            >
              A/B Split
            </CardRadio>
          </RadioGroup>

          {/* Campaign Start Option */}
          <RadioGroup
            orientation='horizontal'
            value={campaignStartOption}
            onValueChange={onCampaignStartOptionChange}
            label={
              <div className='flex gap-2'>
                <CalendarIcon className='w-5' />
                <p>Start Option</p>
              </div>
            }
          >
            <Radio value={CAMPAIGN_START_NOW}>Now</Radio>
            <Radio value={CAMPAIGN_START_SCHEDULE}>Schedule</Radio>
          </RadioGroup>

          {/* Date Picker */}
          {campaignStartOption !== CAMPAIGN_START_NOW && (
            <DatePicker
              aria-label='datetime'
              variant='bordered'
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
                  <p>Datetime</p>
                </div>
              }
            />
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return renderFirstFormPage();
      case 2:
        return renderSecondFormPage();
      default:
        return <div></div>;
    }
  };

  return (
    <div className='flex w-full flex-col items-center'>
      <form ref={ref} className='w-full'>
        <div className='flex w-full items-center justify-between'>
          <NumberCircles
            totalSteps={TOTAL_STEPS}
            currentStep={currentStep}
            onPress={(s) => nextStep(s)}
          />
          <div className='flex items-center gap-4'>
            <div className='flex gap-2'>
              <Skeleton isLoaded={!isCountLoading} className='rounded-lg'>
                <h2 className='text-right text-3xl text-slate-700'>
                  {segmentSize === -1 ? 'No Data' : segmentSize}
                </h2>
              </Skeleton>
              <Tooltip
                showArrow
                color='foreground'
                content='Total number of users'
              >
                <InformationCircleIcon className='w-4' />
              </Tooltip>
            </div>

            <Divider orientation='vertical' className='mx-2 h-10' />

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
              onPress={previousStep}
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
                onPress={() => {
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

        <Drawer
          isOpen={isOpen}
          placement='right'
          onOpenChange={onOpenChange}
          size='5xl'
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className='flex flex-col gap-2'>
                  Email Template
                  <Input
                    id='keyword'
                    name='keyword'
                    variant='bordered'
                    placeholder='Search by name or description...'
                    value={searchTerm}
                    className='w-[500px]'
                    onValueChange={(v) => setSearchTerm(v.toLowerCase())}
                    onClear={() => setSearchTerm('')}
                    isClearable
                  />
                </DrawerHeader>
                <DrawerBody>
                  <div className='grid grid-cols-3 gap-4'>
                    {emails
                      .filter(
                        (email) =>
                          email.name.toLowerCase().indexOf(searchTerm) > -1 ||
                          email.email_desc.toLowerCase().indexOf(searchTerm) >
                            -1
                      )
                      .map((email, i) => (
                        <Card
                          isPressable={true}
                          key={i}
                          shadow='sm'
                          onPress={() => {
                            onEmailChange(
                              activeEmailSelection,
                              'email_id',
                              email.id!
                            );
                            onClose();
                          }}
                          className='h-[400px]'
                        >
                          <CardBody className='h-[400px]'>
                            <div className='overflow-scroll'>
                              <EmailHtml email={email} blockPointerEvents />
                            </div>
                          </CardBody>

                          <Divider />

                          <CardFooter className='flex justify-center'>
                            <Link
                              showAnchorIcon
                              href={`/dashboard/emails/${email.id}`}
                              target='blank'
                            >
                              <p>{email.name}</p>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button color='danger' variant='light' onPress={onClose}>
                    Close
                  </Button>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </form>
    </div>
  );
}

const CardRadio = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      classNames={{
        base: clsx(
          'inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between',
          'max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2',
          'data-[selected=true]:border-primary'
        ),
      }}
      {...otherProps}
    >
      {children}
    </Radio>
  );
};
