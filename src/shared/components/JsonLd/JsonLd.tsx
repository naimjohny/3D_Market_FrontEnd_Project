/** JSON-LD structured data: сериализует объект schema.org в <script type="application/ld+json">. */

import type { ReactElement } from 'react';
import type { JsonLdPropsInterface } from '@app/models/ui/atoms.interface';

export function JsonLd({ data }: JsonLdPropsInterface): ReactElement {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
