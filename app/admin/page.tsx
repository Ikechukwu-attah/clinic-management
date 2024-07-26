import StartCard from '@/components/ui/statCard/startCard'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Label } from '@/components/ui/label';
import { getRecentAppointmentList } from '@/lib/actions/appointment.action';

import { Appointment } from '@/types/appwrite.types';


import { columns } from '@/components/table/columns';
import { DataTable } from '@/components/table/dataTable';





const Admin = async () => {


    const appointments: {
        scheduledCount: number
        pendingCount: number
        cancelledCount: number
        documents: Appointment[]
    } = await getRecentAppointmentList()
    return (
        <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
            <header className='admin-header'>
                <Link href="" className='cursor-pointer'>
                    <Image src="/assets/icons/logo-full.svg" height={32} width={162} alt="Logo" className='cursor-pointer' />
                </Link>

                <p className='text-16-semibold'>Admin Dashboard</p>
            </header>
            
            
            <main className='admin-main'>
                <section className='w-full space-y-4'>
                    <h1 className='header'>Welcome</h1>
                    <p className='text-dark-700'>Start the day with managing new appointments</p>
                    
                </section>
                <section className='admin-stat'>
                    <StartCard type="appointment" count={appointments.scheduledCount}  label="Scheduled Appointments" icon="/assets/icons/appointments.svg" />
                
                    <StartCard type="pending" count={appointments.pendingCount}  label="Pending Appointments" icon="/assets/icons/pending.svg" />

                    <StartCard type="cancelled" count={appointments.cancelledCount}  label="Cancelled Appointments" icon="/assets/icons/cancelled.svg" />

                
                </section>

                
                <DataTable columns={ columns} data={ appointments.documents } />
                {/* <DataTable columns={ columns} data={ data } /> */}
        </main>
        </div>
    )
}

export default Admin