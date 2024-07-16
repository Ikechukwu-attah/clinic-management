"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userFormValidationSchema } from '@/lib/validation';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CustomFormField from '../ui/customFormField/customFormField';
import SubmitButton from '../ui/submitButton/submitButton';
import { createUser } from '@/lib/actions/patient.action';

export enum FormFieldType {
	INPUT = 'input',
	TEXTAREA = 'textarea',
	CHECKBOX = 'checkbox',
	RADIO = 'radio',
	SELECT = 'select',
	SKELETON = 'skeleton',
	PHONE_INPUT = 'phoneInput'
}



const RegisterForm = () => {
  
     const router = useRouter();
	const[isLoading, setIsLoading] = useState(false);
	// 1. Define your form.
	const form = useForm<z.infer<typeof userFormValidationSchema>>({
		resolver: zodResolver(userFormValidationSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: ''
		}
	});

	// 2. Define a submit handler.
	async function onSubmit({name,email,phone}: z.infer<typeof userFormValidationSchema>) {
		setIsLoading(true);

		try {
			const userData = {
				name,
				email,
				phone
			};

			console.log(userData);
			const user = await createUser(userData);
			console.log(user)
			if(user) router.push(`/patients/${user.$id}/register`);
		} catch (error) {
			console.log(error);
		}
		
		
	}

	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				<section className=" mb-12 space-y-4">
					<h1 className="header">Hi there </h1>
					<p className="text-dark-700700">Schedule your first appointment</p>
				</section>
				<CustomFormField
					formFieldType={FormFieldType.INPUT}
					control={form.control}
					name="name"
					label="Full name"
					placeholder="John doe"
					iconSrc="/assets/icons/user.svg"
					iconAlt="user"
				/>

				<CustomFormField
					formFieldType={FormFieldType.INPUT}
					control={form.control}
					name="email"
					label="Email"
					placeholder="John@gmail.com"
					iconSrc="/assets/icons/email.svg"
					iconAlt="email"
				/>

				<CustomFormField
					formFieldType={FormFieldType.PHONE_INPUT}
					control={form.control}
					name="phone"
					label="Phone number"
					placeholder="123 456321"
				/>
				<SubmitButton isLoading={isLoading}>Get started </SubmitButton>
			</form>
        </Form>
    )
  
}

export default RegisterForm