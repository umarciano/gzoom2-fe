import { Enumeration } from "./enumeration";

/**
 * Model of GlFiscalTypeEx
 */
export class GlFiscalTypeEx {
    glFiscalTypeId?: string;
    description?: string;
    descriptionLang?: string;
    glFiscalTypeEnumId?: string;
    isAccountUsed?: string;
    isFinancialUsed?: string;
    isIndicatorUsed?: string;
    enumeration?: Enumeration;
  }
  