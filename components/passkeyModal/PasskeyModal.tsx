"use client"

import React, { useEffect } from 'react'
import { on } from 'events';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"






import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { decryptKey, encryptKey } from '@/app/lib/utils';
import { set } from 'zod';





const PasskeyModal = () => {
    const router = useRouter()
    const [open, setOpen] = React.useState(true)
    const [passkey, setPasskey] = React.useState('')
    const [error, setError] = React.useState('')
    
    const path = usePathname()
    const closeModal = () => {
        setOpen(false)
        router.push('/')
    }
    
    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accesskey') : null
   
    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey)
        if (path) {
            
           if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
              console.log("admin works")
               setOpen(false)
               console.log("admin works")
               router.push('/admin')
        } else {
            setOpen(true)
        }
        }
    }, [encryptedKey])

    const validatePasskey = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
        e.preventDefault()
        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey)

            localStorage.setItem("accesskey", encryptedKey)
            setOpen(false)
        } else {
            setError('Invalid passkey. Please try again.')
        }
    }
    
  return (
      <AlertDialog open={open} onOpenChange={setOpen}>
  
  <AlertDialogContent className='shad-alert-dialog'>
    <AlertDialogHeader>
                  <AlertDialogTitle className='flex items-start justify-between'>Admin Access Verification
                      
                       <Image src="/assets/icons/close.svg" height={20} width={20} alt="close" onClick={()=>closeModal()} className='cursor-pointer' />
      </AlertDialogTitle>
      
                  <AlertDialogDescription>
        Too access admin page, please enter the  passkey below
      </AlertDialogDescription>
              </AlertDialogHeader>
              

              <div>
                <InputOTP maxLength={6} value={passkey} onChange={(value)=>setPasskey(value)}>
                <InputOTPGroup className="shad-otp">
                    <InputOTPSlot className="shad-otp-slot" index={0} />
                    <InputOTPSlot className="shad-otp-slot" index={1} />
                    <InputOTPSlot className="shad-otp-slot" index={2} />
                    <InputOTPSlot className="shad-otp-slot" index={3} />
                    <InputOTPSlot className="shad-otp-slot" index={4} />
                    <InputOTPSlot className="shad-otp-slot" index={5} />
                </InputOTPGroup>
               
                
                </InputOTP>
                  {error && <p className='shad-error text-14-regular mt-4 flex justify-center'>{ error}</p>}
              </div>
    <AlertDialogFooter>
      
      <AlertDialogAction onClick={(e)=>validatePasskey(e)} className='shad-primary-btn w-full'>Enter Admin Passkey</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  )
}

export default PasskeyModal