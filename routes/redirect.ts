/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'

import * as challengeUtils from '../lib/challengeUtils'
import { challenges } from '../data/datacache'
import * as security from '../lib/insecurity'
import * as utils from '../lib/utils'

export function performRedirect() {
  return ({ query }: Request, res: Response, next: NextFunction) => {
    const raw = String(query.to ?? '')

    let parsed: URL
    try {
      parsed = new URL(raw)
    } catch {
      res.status(406)
      return next(new Error('Unrecognized target URL for redirect: ' + raw))
    }

    // Appliquer exclusivement le protocole HTTPS, en empêchant les protocoles HTTP, JavaScript, data: et autres.
    if (parsed.protocol !== 'https:') {
      res.status(406)
      return next(new Error('Unrecognized target URL for redirect: ' + raw))
    }

    // Normalisation (pour empêcher le contournement par le biais de l'encodage/la sensibilité à la casse, etc.)
    const toUrl = parsed.toString()

    if (security.isRedirectAllowed(toUrl)) {
      challengeUtils.solveIf(challenges.redirectCryptoCurrencyChallenge, () => {
        return toUrl === 'https://explorer.dash.org/address/Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW' ||
          toUrl === 'https://blockchain.info/address/1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm' ||
          toUrl === 'https://etherscan.io/address/0x0f933ab9fcaaa782d0279c300d73750e1311eae6'
      })
      challengeUtils.solveIf(challenges.redirectChallenge, () => { return isUnintendedRedirect(toUrl) })
      return res.redirect(toUrl)
    }

    res.status(406)
    return next(new Error('Unrecognized target URL for redirect: ' + raw))
  }
}
