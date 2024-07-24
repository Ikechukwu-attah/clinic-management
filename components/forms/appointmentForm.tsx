'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CustomFormField from '../ui/customFormField/customFormField';
import SubmitButton from '../ui/submitButton/submitButton';
import React, { useState } from 'react';
import { AppointmentFormValidation, UserFormValidation } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/actions/patient.action';
import { Doctors } from '@/constants';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import App from 'next/app';
import { createAppointment } from '@/lib/actions/appointment.action';

export enum FormFieldType {
	INPUT = 'input',
	TEXTAREA = 'textarea',
	CHECKBOX = 'checkbox',
	RADIO = 'radio',
	SELECT = 'select',
	SKELETON = 'skeleton',
	PHONE_INPUT = 'phoneInput',
	DATE_PICKER = 'datePicker'
}




const AppointmentForm = ({userId, patientId, type}:{userId:string, patientId:string, type:"create"|"cancel" | "schedule"}) => {
  const router = useRouter();
	const[isLoading, setIsLoading] = useState(false);
	// 1. Define your form.
	const form = useForm<z.infer<typeof AppointmentFormValidation>>({
		resolver: zodResolver(AppointmentFormValidation),
		defaultValues: {
			primaryPhysician: '',
			schedule: new Date(),
			reason: '',
			note: '',
			cancellationReason: '',
		}
	});

	let buttonLabel;

	switch (type) {
		case 'cancel':
			buttonLabel = 'Cancel Appointment';
			break;
		case 'create':
			buttonLabel = 'Create Appointment';
			break;
		
		case 'schedule':
			buttonLabel = 'Schedule Appointment';
			break;
		
		// default:
		// 	buttonLabel = 'Create Appointment';
	}

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
		setIsLoading(true);

		let status;

		switch (type) {
			case 'cancel':
				status = 'cancelled';
				break;
			
			case 'schedule':
				status = 'scheduled';
				break;
			default:
				status = 'pending';
				break;
			
		}




		try {
			if (type === 'create' && patientId) {
				const appointmentData = {
					userId,
					patient: patientId,
					primaryPhysician: values.primaryPhysician,
					schedule: new Date(values.schedule),
					reason: values.reason,
					note: values.note,
					status: status as Status
				}

				const appointment = await createAppointment(appointmentData);

				if (appointment) {
					form.reset();
					router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
				}
			}

			
		} catch (error) {
			console.log(error);
		}
		
		
	}

	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
				<section className=" mb-12 space-y-4">
					<h1 className="header">New Appointment </h1>
					<p className="text-dark-700700">Request for a new appointment</p>
                </section>
                {type !== "cancel" && (
                    <>
                        <CustomFormField
					formFieldType={FormFieldType.SELECT}
					control={form.control}
					name="primaryPhysician"
					label="Primary Physician"
					placeholder="Select a physician"
					
                >
                    {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                         
                            <div className='flex cursor-pointer items-center gap-2'>

                                <Image src={doctor.image} alt={doctor.name} width={32} height={32} className='rounded-full border border-dark-500' />
                                <p>   {doctor.name}</p>
                            </div>
                       </SelectItem>  
                   ))} 
                        </CustomFormField>
                        
                        <CustomFormField formFieldType={FormFieldType.DATE_PICKER} 
                        control={form.control} 
                        name="schedule" 
                        label="Expected appointment date" 
							showTimeSelect dateFormat='MM/dd/yyyy - h:mm aa' />
						

						<div className="flex flex-col gap-6 xl:flex-row">
							<CustomFormField
							
								formFieldType={FormFieldType.TEXTAREA}
								name='reason'
								control={form.control}
								label='Reason for appointment'
								placeholder='Please provide a reason for your appointment'
							
							/>

							<CustomFormField
							
								formFieldType={FormFieldType.TEXTAREA}
								name='notes'
								control={form.control}
								label='Notes'
								placeholder='Enter notes'
							
							/>

						</div>
                    </>
                )}

				
				{type === "cancel" && (
					<CustomFormField
						formFieldType={FormFieldType.TEXTAREA}
						control={form.control}
						name='cancellationReason'
						label='Reason for cancellation'
						placeholder='Enter reason for cancellation'
					/>
				)}
				

				
				<SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shade-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
			</form>
		</Form>
	);
};
export default AppointmentForm;
