import React from 'react'
import { Briefcase } from 'lucide-react'

export default function Title() {
  return (
    <>
      <h1 className='flex flex items-center gap-2 text-lg font-semibold pb-1'>
        <Briefcase className='w-5 h-5' />
        Generate Your Tailored Resume & Cover Letter
      </h1>

      <p className='text-sm text-muted-foreground text-gray-500'>
        Provide your job details and current resume to get AI-powered, tailored documents.
      </p>
    </>
  )
}