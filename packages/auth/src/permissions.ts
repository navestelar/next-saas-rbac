import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permission: Record<Role, PermissionsByRole> = {
  ADMIN(_, { can } /* builder: { can, cannot } */) {
    can('manage', 'all')
  },
  MEMBER(_, { can }) {
    // can('invite', 'User')
    can('create', 'Project')
  },
  BILLING() {},
}
