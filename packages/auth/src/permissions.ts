import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'

export type Role = 'ADMIN' | 'MEMBER'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permission: Record<Role, PermissionsByRole> = {
  ADMIN(_, { can } /* builder: { can, cannot } */) {
    can('manage', 'all')
  },
  MEMBER(_, { can }) {
    can('invite', 'User')
  },
}
