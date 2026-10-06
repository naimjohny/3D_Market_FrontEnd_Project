/** Контракт страницы юридических документов: вид документа, секция текста и props компонента. */

export type LegalKindType = 'offer' | 'privacy' | 'refunds';

export interface LegalSectionInterface {
  readonly TITLE: string;
  readonly BODY: string;
}

export interface LegalPagePropsInterface {
  readonly kind: LegalKindType;
}
