import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const FormInput = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  type = "text", 
  className = "" 
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel className="ml-1">{label}</FormLabel>}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="h-12 rounded-xl px-4 border-gray-200 focus-visible:ring-blue-500 placeholder:text-xs transition-all"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;