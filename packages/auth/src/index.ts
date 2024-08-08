import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { billingSubject } from './models/subjects/billing'
import { inviteSubject } from './models/subjects/invite'
import { organizationSubject } from './models/subjects/organization'
import { projectSubject } from './models/subjects/project'
import { userSubject } from './models/subjects/user'
import { User } from './models/user'
import { permission } from './permissions'

const appAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  inviteSubject,
  organizationSubject,
  billingSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permission[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permission[user.role](user, builder)

  const ability = builder.build()

  return ability
}
