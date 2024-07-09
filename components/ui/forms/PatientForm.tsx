'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CustomFormField from '../customFormField/customFormField';

export enum FormFieldType {
	INPUT = 'input',
	TEXTAREA = 'textarea',
	CHECKBOX = 'checkbox',
	RADIO = 'radio',
	SELECT = 'select',
	SKELETON = 'skeleton',
	PHONE_INPUT = 'phoneInput'
}

const formSchema = z.object({
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	})
});

const PatientForm = () => {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: ''
		}
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
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
				<Button type="submit">Submit</Button>
			</form>
			<h1>hello james</h1>
		</Form>
	);
};
export default PatientForm;
