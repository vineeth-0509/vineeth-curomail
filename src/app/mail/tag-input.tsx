import useThreads from "@/hooks/use-threads";
import { api } from "@/trpc/react";
import React from "react";
import Avatar from "react-avatar";
import Select from "react-select";
import { useState } from "react";
type Props = {
  placeholder: string;
  label: string;

  onChange: (values: { label: string; value: string }[]) => void;
  value: { label: string; value: string }[];
};

const TagInput = ({ placeholder, label, onChange, value }: Props) => {
  const { accountId } = useThreads();
  const [inputValue, setInputValue] = useState("");
  const { data: suggestions } = api.account.getSuggestions.useQuery({
    accountId,
  });
  const options = suggestions?.map((suggestion) => ({
    label: (
      <span className="flex items-center gap-2">
        <Avatar
          name={suggestion.address}
          size="25"
          textSizeRatio={2}
          round={true}
        />
        {suggestion.address}
      </span>
    ),
    value: suggestion.address,
  }));
  return (
    <div className="flex items-center rounded-md border">
      <span className="ml-3 text-sm text-gray-500">{label}</span>
      <Select
        onInputChange={setInputValue}
        value={value}
        // @ts-ignore
        onChange={onChange}
        className="w-full flex-1 text-black dark:bg-gray-700"
        isMulti
        placeholder={""}
        //@ts-ignore
        options={
          inputValue
            ? options?.concat({
                //@ts-ignore
                label: inputValue,
                value: inputValue,
              })
            : options
        }
        classNames={{
          control: () => {
            return "!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent";
          },
          multiValue: () => {
            return "dark:!bg-gray-700 text-black";
          },
          multiValueLabel: () => {
            return "dark:bg-gray-700 text-black rounded-md";
          },
        }}
        classNamePrefix="select"
      />
    </div>
  );
};

export default TagInput;

// import React, { useState } from 'react';
// import Avatar from 'react-avatar';
// import Select from 'react-select';

// type TagInputProps = {
//     suggestions: string[];
//     defaultValues?: { label: string, value: string }[];
//     placeholder: string;
//     label: string;

//     onChange: (values: { label: string, value: string }[]) => void;
//     value: { label: string, value: string }[];
// };

// const TagInput: React.FC<TagInputProps> = ({ suggestions, defaultValues = [], label, onChange, value }) => {
//     const [input, setInput] = useState('');

//     const options = suggestions?.map(suggestion => ({
//         label: (
//             <span className='flex items-center gap-2'>
//                 <Avatar name={suggestion} size='25' textSizeRatio={2} round={true} />
//                 {suggestion}
//             </span>
//         ), value: suggestion
//     }));

//     return <div className="border rounded-md flex items-center">
//         <span className='ml-3 text-sm text-gray-500'>{label}</span>
//         <Select
//             value={value}
//             // @ts-ignore
//             onChange={onChange}
//             className='w-full flex-1'
//             isMulti
//             onInputChange={setInput}
//             defaultValue={defaultValues}
//             placeholder={''}
//             options={input ? options.concat({
//                 label: (
//                     <span className='flex items-center gap-2'>
//                         <Avatar name={input} size='25' textSizeRatio={2} round={true} />
//                         {input}
//                     </span>
//                 ), value: input
//             }) : options}
//             classNames={{
//                 control: () => {
//                     return '!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent'
//                 },
//                 multiValue: () => {
//                     return 'dark:!bg-gray-700'
//                 },
//                 multiValueLabel: () => {
//                     return 'dark:text-white dark:bg-gray-700 rounded-md'
//                 }
//             }}
//             classNamePrefix="select"
//         />
//     </div>
// };

// export default TagInput;
