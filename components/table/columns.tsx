"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StatusBadge from "../ui/statusBadge"
import { formatDateTime } from '../../app/lib/utils';
import { Doctors } from "@/constants"
import Image from "next/image"
import App from "next/app"
import AppointmentModal from "../appointmentModal/appointmentModal"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

export const columns: ColumnDef<any>[] = [


    {
        header: 'ID',
        cell: ({ row }) => <p className="text-14-medium">{row.index + 1 }</p>
  },


    {
        accessorKey: 'patient',
        header: "Patient",
        cell: ({ row }) => 
            
             <p className="text-14-medium">{row.original.patient.name }</p>

       
  },

  {
    accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
          <StatusBadge status={ row.original.status} />
    )
  },
  {
    accessorKey: "schedule",
      header: "Appointment",
      cell: ({ row }) => (
          <p className="text-14-regular min-w-[100px]">
              { formatDateTime(row.original.schedule).dateTime }
        </p>
    )
  },
  {
    accessorKey: "primaryPhysician",
    header: () => 'Doctor',
    cell: ({ row }) => {
      const doctor = Doctors.find((doc)=>doc.name === row.original.primaryPhysician)
        return (
            <div className="flex items-center gap-3">
                <Image src={doctor?.image} height={100} width={100} alt={doctor?.name} className='size-8' />
                <p className="whitespace-nowrap">Dr.{doctor?.name }</p>
        </div>
    )
    },

    },
  
  
  
  {
      id: "actions",
      header:()=><div className="pl-4">Actions</div>,
    cell: ({ row:{original:data} }) => {
        return (
            <div className="flex gap-1">
                <AppointmentModal type="schedule" paitientId={data.patient.$id} userId={data.userId} appointment={data} title="Schedule Appointment" description="Please confirm the following details to schedule an appointment" />
                <AppointmentModal type="cancel" paitientId={data.patient.$id} userId={data.userId} appointment={data} title="Schedule Appointment" description="Are you sure you want to cancel this  appointment?" />

         </div>
     )
 
     
    },
  },
]