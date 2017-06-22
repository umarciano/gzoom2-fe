/**
 * Model of a hero.
 */
export class Uom {
  constructor(public uom_id: string, public uom_type_id: string, public abbreviation: string, public description: string,
              public decimalScale: number, public minValue: number, public maxValue: number) { }
}
