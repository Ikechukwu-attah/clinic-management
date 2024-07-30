

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import App from 'next/app';
import AppointmentForm from '@/components/forms/appointmentForm';
import { getPatient } from '@/lib/actions/patient.action';
import * as Sentry from '@sentry/react'


const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);
   Sentry.metrics.set("user_view_new-appointment", patient.name)
  return (
     <div className="flex h-screen max-h-screen">
      {/* {isAdmin && <PasskeyModal />} */}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm type="create" userId={userId} patientId={patient.$id} />

         
            <p className=" copyright justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>
           
     
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px]"
      />
    </div>
  )
}

export default NewAppointment