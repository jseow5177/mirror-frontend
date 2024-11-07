import { Lookup } from '@/app/lib/model/segment';
import { Input, Select, Checkbox } from '@nextui-org/react';

type LookupProps = {
  lookup?: Lookup;
  onChange?: (lookup: Lookup) => void;
};

const LookupBuilder = ({ lookup, onChange = () => {} }: LookupProps) => {
  const handleChange = (key: keyof Lookup, value: any) => {};
  return <div></div>;
};
