'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePublicPath(path: string = '/') {
  revalidatePath(path, 'layout')
}
