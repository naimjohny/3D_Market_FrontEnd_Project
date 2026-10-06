/** Маппер вид→компонент: единая точка рендера процедурной модели по ModelKindType. */

import type { ReactElement } from 'react';
import type { ProductModelPropsInterface } from '@app/models/ui/three.interface';
import { BlobModel } from './models/BlobModel';
import { ColumnModel } from './models/ColumnModel';
import { CrystalModel } from './models/CrystalModel';
import { DroneModel } from './models/DroneModel';
import { HelmetModel } from './models/HelmetModel';
import { PlanetModel } from './models/PlanetModel';
import { ShellModel } from './models/ShellModel';
import { SpiralModel } from './models/SpiralModel';
import { TorusModel } from './models/TorusModel';
import { WaveModel } from './models/WaveModel';

export function ProductModel({ kind, ...props }: ProductModelPropsInterface): ReactElement {
  switch (kind) {
    case 'torus':
      return <TorusModel {...props} />;
    case 'crystal':
      return <CrystalModel {...props} />;
    case 'blob':
      return <BlobModel {...props} />;
    case 'planet':
      return <PlanetModel {...props} />;
    case 'helmet':
      return <HelmetModel {...props} />;
    case 'column':
      return <ColumnModel {...props} />;
    case 'spiral':
      return <SpiralModel {...props} />;
    case 'drone':
      return <DroneModel {...props} />;
    case 'wave':
      return <WaveModel {...props} />;
    case 'shell':
      return <ShellModel {...props} />;
  }
}
