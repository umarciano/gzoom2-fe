/**
 * Model of a hero.
 */
export class Uom {
  constructor(public uomId?: string, public uomTypeId?: string, public abbreviation?: string, public description?: string,
              public decimalScale?: number, public minValue?: number, public maxValue?: number) { }
}
