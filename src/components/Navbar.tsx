import Link from 'next/link'
import React from 'react'
import { Icons } from './Icons'
import { buttonVariants } from './ui/Button'

const Navbar = () => {
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
        <div className='container max-w-7xl mx-auto flex items justify-between gap-2'>

            <Link href="/" className=' flex gap-2 items-center'>
                <Icons.logo className=' h-8 w-8 sm:w-6 sm:h-6' />
                <p className=' hidden text-zinc-700 text-sm font-medium md:block'>Breadit</p>
            </Link>

            {/* {searchBar} */}

            <Link href="/sign-in" className={buttonVariants()}>Sign-in</Link>
        </div>
    </div>
  )
}

export default Navbar