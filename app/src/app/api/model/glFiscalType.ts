/**
 * Model of GlFiscalType
 */
export class GlFiscalType {
  glFiscalTypeId?: string;
  description?: string;
  descriptionLang?: string;
  glFiscalTypeEnumId?: string;
  isFinancialUsed?: string;
  isAccountUsed?: string;
  isIndicatorUsed?: string;

  constructor(glFiscalTypeId: string,
    description: string,
    descriptionLang: string,
    glFiscalTypeEnumId: string,
    isFinancialUsed: string,
    isAccountUsed: string,
    isIndicatorUsed: string,) {
    this.glFiscalTypeId = glFiscalTypeId;
    this.description = description;
    this.descriptionLang = descriptionLang;
    this.glFiscalTypeEnumId = glFiscalTypeEnumId;
    this.isAccountUsed = isAccountUsed;
    this.isFinancialUsed = isFinancialUsed;
    this.isIndicatorUsed = isIndicatorUsed;
  }
}
