import { UomType } from '../uom-type/uom_type';

/**
 * Model of a hero.
 */
export class Uom {
  constructor(public uomId?: string, public uomTypeId?: string, public uomType?: UomType, public abbreviation?: string, public description?: string,
              public decimalScale?: number, public minValue?: number, public maxValue?: number) { }
}
