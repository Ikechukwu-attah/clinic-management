'use client';

import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';
import { Control } from 'react-hook-form';
import { FormFieldType } from '../forms/PatientForm';
import Image from 'next/image';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

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
