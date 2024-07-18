'use client';

import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';
import { Control } from 'react-hook-form';
import { FormFieldType } from '../../forms/PatientForm';
import Image from 'next/image';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '../select';
import { Textarea } from '../textarea';
import { Checkbox } from '../checkbox';

interface CustomProps {
	control: Control<any>;
	formFieldType: FormFieldType;
	name: string;
	label?: string;
	placeholder?: string;
	iconSrc?: string;
	iconAlt?: string;
	disabled?: boolean;
	dateFormat?: string;
	showTimeSelect?: boolean;
	children?: React.ReactNode;
	renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
	const {
		formFieldType,
		name,
		label,
		placeholder,
		iconSrc,
		iconAlt,
		disabled,
		dateFormat,
		showTimeSelect,
		children,
		
		renderSkeleton
	} = props;
	switch (formFieldType) {
		case FormFieldType.INPUT:
			return (
				<div className="flex rounded-md border border-dark-500 bg-dark-400">
					{iconSrc && <Image src={iconSrc} alt={iconAlt || 'User'} className="ml-2" width={24} height={24} />}

					<FormControl>
						<Input placeholder={placeholder} {...field} className="shad-input border-0" />
					</FormControl>
				</div>
			);
		case FormFieldType.TEXTAREA:
			return (
				<FormControl>
					<Textarea placeholder={placeholder} {...field} className="shad-textArea " disabled={disabled} />
				</FormControl>
			)
			
		case FormFieldType.PHONE_INPUT:
			return (
				<FormControl>
					<PhoneInput
						defaultCountry="US"
						placeholder={props.placeholder}
						international
						withCountryCallingCode
						value={field.value as E164Number | undefined}
						onChange={field.onChange}
						className="input-phone"
					/>
				</FormControl>
			);

		case FormFieldType.DATE_PICKER:
			return (
				<div className="flex rounded-md border border-dark-500 bg-dark-400">
					<Image src="/assets/icons/calendar.svg"
						alt="Calendar" className="ml-2" width={24} height={24} />

					<FormControl>

						<DatePicker selected={field.value} onChange={(date) => field.onChange(date)}
							dateFormat={dateFormat ?? 'MM/dd/yyyy'} showTimeSelect={showTimeSelect ?? false}
						     timeInputLabel='Time:' wrapperClassName='date-picker'/>
						
						

					</FormControl>
				</div>
			);

		case FormFieldType.SKELETON:
			return(
				renderSkeleton ? renderSkeleton(field) : null
			)
		
		case FormFieldType.SELECT:
			return (
				<FormControl>
					<Select onValueChange={field.onChange} defaultValue={field.value} >
						<FormControl >
							<SelectTrigger className='shad-select-trigger'> <SelectValue placeholder={placeholder} /></SelectTrigger>
                            
						</FormControl>
						<SelectContent className='shad-select-content'>
							{children}
						</SelectContent>
					</Select>
				</FormControl>
			)
		case FormFieldType.CHECKBOX:
			return (
				<FormControl>
					<div className='flex items-center gap-2'>
						<Checkbox id={name} checked={ field.value} onCheckedChange={field.onChange} />
						<label className ="checkbox-label"htmlFor={name}>{label}</label>
					</div>
				</FormControl>
			
			)
				
		
		default:
			break;
	}
};

const CustomFormField = (props: CustomProps) => {
	const { control, formFieldType, name, label } = props;
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex-1">
					{formFieldType !== FormFieldType.CHECKBOX && label && <FormLabel>{label}</FormLabel>}
					<RenderField field={field} props={props} />
					<FormMessage className="shad-error" />
				</FormItem>
			)}
		/>
	);
};

export default CustomFormField;
