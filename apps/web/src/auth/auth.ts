import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'

export function isAuthenticated() {
  // @ts-expect-error The type ask for an await, but don't need it
  return !!cookies().get('token')?.value
}

export function getCurrentOrg() {
  // @ts-expect-error The type ask for an await, but don't need it
  return cookies().get('org')?.value ?? null
}

export async function getCurrentMembership() {
  const org = getCurrentOrg()
  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)
  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()
  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })
  return ability
}

export async function auth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch (e) {
    console.error(e)
  }

  redirect('/api/auth/sign-out')
}
