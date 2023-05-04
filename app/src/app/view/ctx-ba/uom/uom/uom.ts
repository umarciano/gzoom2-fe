import { UomType } from '../uom-type/uom_type';

/**
 * Model of a Uom.
 */
export class Uom {
  constructor(public uomId?: string, public uomTypeId?: string, public uomType?: UomType, public abbreviation?: string, public description?: string, public descriptionLang?: string, public abbreviationLang?: string,
              public decimalScale?: number, public minValue?: number, public maxValue?: number) { }
}
