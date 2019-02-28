import { Uom } from '../uom/uom';

/**
 * Model of a UomRatingScale.
 */
export class UomRatingScale {
  constructor(public uomId?: string, public uom?: Uom, public uomRatingValue?: number, public description?: string) { }
}
