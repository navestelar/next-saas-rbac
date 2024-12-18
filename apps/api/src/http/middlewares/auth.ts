import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token')
      }
    }

    request.getUserMembership = async (organizationSlug: string) => {
      const userId = await request.getCurrentUserId()
      const member = await prisma.member.findFirst({
        where: {
          userId,
          organization: {
            slug: organizationSlug,
          },
        },

        // get the organization data
        include: {
          organization: true,
        },
      })

      if (!member) {
        throw new UnauthorizedError('You are not a member of the organization.')
      }

      const {
        organization,
        ...membership /* place all the other atributes in the variable membership */
      } = member

      return {
        organization,
        membership,
      }
    }
  })
})
