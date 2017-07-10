import { Uom } from '../uom/uom';

/**
 * Model of a hero.
 */
export class UomRatingScale {
  constructor(public uomId?: string, public uom?: Uom, public uomRatingValue?: number, public description?: string) { }
}
