import { Request } from "express";
import isEthereumAddress from 'validator/lib/isEthereumAddress'
import Catalyst, { Avatar } from "../../utils/api/Catalyst";
import API from "../../utils/api/API";
import RequestError from "../Route/error";
import param from "../Route/param";
import { WithAuth } from "../Auth/middleware";
import { middleware } from "../Route/handle";

export type WithProfile<R extends Request = Request> = R & {
  profile?: Avatar
}

export type WithAuthProfile<R extends Request = Request> = R & {
  authProfile?: Avatar
}

export type WithProfileOptions = {
  optional?: boolean,
}

export function getUserParam(req: Request) {
  return param(req, 'user', isEthereumAddress)
}

export function withProfile(options: WithProfileOptions = {}) {
  return middleware(async (req) => {
    const user = getUserParam(req).toLowerCase()
    const profile = await API.catch(Catalyst.get().getProfile(user))

    if (!profile && !options.optional) {
      throw new RequestError(`Not found profile for "${user}"`, RequestError.NotFound)
    }

    Object.assign(req, { profile })
  })
}

export function withAuthProfile(options: WithProfileOptions = {}) {
  return middleware(async (req) => {
    const user = (req as WithAuth).auth

    if (!user && !options.optional) {
      throw new RequestError(`Not found user "${user}"`, RequestError.Forbidden)
    } else if (!user) {
      return
    }

    const authProfile = await API.catch(Catalyst.get().getProfile(user))

    if (!authProfile && !options.optional) {
      throw new RequestError(`Not found profile for "${user}"`, RequestError.NotFound)
    }

    Object.assign(req, { authProfile })
  })
}
