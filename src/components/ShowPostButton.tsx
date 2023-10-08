"use client"
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/Button'
import { usePathname } from 'next/navigation'

type Props = {
    isSubscribed: boolean,
    name : string
}

const ShowPostButton = ({isSubscribed, name}: Props) => {
    const pathname = usePathname()

    if (isSubscribed && !pathname.endsWith("submit")) {
        return (
            <Link href={`/r/${name}/submit`} className={buttonVariants({className : "w-full mb-6"})}>Create Post</Link>
        )
    }

    return null
}

export default ShowPostButton