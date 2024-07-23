"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PatientFormValidation } from '@/lib/validation';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CustomFormField from '../ui/customFormField/customFormField';
import SubmitButton from '../ui/submitButton/submitButton';
import { createUser, registerPatient } from '@/lib/actions/patient.action';
import { FormFieldType } from './PatientForm';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from '@/constants';
import { Label } from '../ui/label';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import FileUploader from '../FileUploader';
import { on } from 'events';
import { blob } from 'stream/consumers';





const RegisterForm = ({user}:{user:User}) => {
  
     const router = useRouter();
	const[isLoading, setIsLoading] = useState(false);
	// 1. Define your form.
	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
			name: '',
			email: '',
			phone: ''
		}
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
		setIsLoading(true);
        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], { type: values.identificationDocument[0].type })
                 formData = new FormData();
            formData.append('blobFle', blobFile);
            formData.append('filename', values.identificationDocument[0].name);
        }

       
		try {
			
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData
          }
			//@ts-ignore
            const patient = await registerPatient(patientData);
            if(patient)router.push(`/patients/${user.$id}/new-appointment`);
		} catch (error) {
			console.log(error);
		}
		
		
	}

	
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
				<section className=" space-y-4">
					<h1 className="header">Welcome </h1>
					<p className="text-dark-700">Let us know more about yourself</p>
				</section>


                <section className=" space-y-6">
                    <div className='mb-9 space-y-1'>
                        	<h2 className="sub-header">personal Information </h2>
                    </div>
				
					
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

                <div className='flex flex-col gap-6 xl:flex-row'>
                    
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
                </div>



                
                <div className='flex flex-col gap-6 xl:flex-row'>
                   <CustomFormField
					formFieldType={FormFieldType.DATE_PICKER}
					control={form.control}
					name="birthDate"
					label="Date of birth"
					placeholder="John@gmail.com"
					
				/>

				<CustomFormField
					formFieldType={FormFieldType.SKELETON}
					control={form.control}
					name="gender"
					label="Gender"
                        renderSkeleton={(field) => (<FormControl className='w-full'>
                            <RadioGroup className='flex h-11 gap-6 xl:justify-between' onValueChange={field.onChange} defaultValue={field.value}>
                                
                                {GenderOptions.map((option) => (
                                    <div key={option} className='radio-group'>

                                        <RadioGroupItem value={option} id={option} />
                                        <Label htmlFor={option} className='cursor-pointer'>{option }</Label>
                                        
                                    </div>
                                ))}
                            </RadioGroup>
                    </FormControl>)}
				/>
                </div>

         
                 <div className='flex flex-col gap-6 xl:flex-row'>
                    <CustomFormField
					formFieldType={FormFieldType.INPUT}
					control={form.control}
					name="address"
					label="Address"
					placeholder="27 Brown Street New York"
				
                    />
                    

                        <CustomFormField
					formFieldType={FormFieldType.INPUT}
					control={form.control}
					name="occupation"
					label="Occupation"
					placeholder="Software Engineer"
				
				/>
                </div>


                 <div className='flex flex-col gap-6 xl:flex-row'>
                         <CustomFormField
					formFieldType={FormFieldType.INPUT}
					control={form.control}
					name="emergencyContactName"
					label="Emergency contact name"
					placeholder="Guardian name"
					
				/>

				<CustomFormField
					formFieldType={FormFieldType.PHONE_INPUT}
					control={form.control}
					name="emergencyContactNumber"
					label="Emergency contact number"
					placeholder="123 456321"
				/>
                </div>

                     <section className=" space-y-6">
                    <div className='mb-9 space-y-1'>
                        	<h2 className="sub-header">Medical Information </h2>
                    </div>
				
					
				</section> 

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
                

                 <div className='flex flex-col gap-6 xl:flex-row'>
                       <CustomFormField
					formFieldType={FormFieldType.INPUT}
					control={form.control}
					name="insuranceProvider"
					label="Insurance provider"
					placeholder="More care"
				
                    />
                    

                        <CustomFormField
					formFieldType={FormFieldType.INPUT}
					control={form.control}
					name="insurancePolicyNumber"
					label="Insurance policy number"
					placeholder="123UTYT456321VCF"
				
				/>
                </div>


                 <div className='flex flex-col gap-6 xl:flex-row'>
                       <CustomFormField
					formFieldType={FormFieldType.TEXTAREA}
					control={form.control}
					name="allergies"
					label="Allergies (if any)"
					placeholder="Peanuts, eggs, etc"
				
                    />
                    

                        <CustomFormField
					formFieldType={FormFieldType.TEXTAREA}
					control={form.control}
					name="currentMedication"
					label="Current medication (if any)"
					placeholder="Aspirin, Ibuprofen, etc"
				
				/>
                </div>




                <div className='flex flex-col gap-6 xl:flex-row'>
                       <CustomFormField
					formFieldType={FormFieldType.TEXTAREA}
					control={form.control}
					name="familyMedicalHistory"
					label="Family medical history (if any)"
					placeholder="Asthma, Diabetes, etc"
				
                    />
                    

                        <CustomFormField
					formFieldType={FormFieldType.TEXTAREA}
					control={form.control}
					name="pastMedicalHistory"
					label="Past medical history (if any)"
					placeholder="Appendicitis, Diabetes, etc"
				
				/>
                </div>

                  <section className=" space-y-6">
                    <div className='mb-9 space-y-1'>
                        	<h2 className="sub-header">Identification and Verification </h2>
                    </div>
				
					
				</section> 

                <CustomFormField
					formFieldType={FormFieldType.SELECT}
					control={form.control}
					name="identificationType"
					label="Identification type"
					placeholder="Select an identification type"
					
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                       </SelectItem> 
                   ))} 
               </CustomFormField>

                   <CustomFormField
					formFieldType={FormFieldType.INPUT}
					control={form.control}
					name="identificationNumber"
					label="Identification number"
					placeholder="18348291"
				
				/>


         <CustomFormField
					formFieldType={FormFieldType.SKELETON}
					control={form.control}
					name="identificationDocument"
					label="Scanned copy of identification document"
                        renderSkeleton={(field) => (<FormControl className='w-full'>
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                          </FormControl>
                    </FormControl>)}
				/>





                <section className=" space-y-6">
                    <div className='mb-9 space-y-1'>
                        	<h2 className="sub-header">Consent and Privacy </h2>
                    </div>
				
					
				</section> 

                <CustomFormField
                    formFieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label='I consent to treatment'
                />

                   <CustomFormField
                    formFieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label='I consent to disclosure of information'
                />

                
                   <CustomFormField
                    formFieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label='I consent to privacy policy'
                />


			
				<SubmitButton isLoading={isLoading}>Get started </SubmitButton>
			</form>
        </Form>
    )
  
}

export default RegisterForm