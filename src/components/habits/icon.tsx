import { Activity, AlarmPlus, Anchor, Binary, Box } from 'lucide-react';

import { Color, Icon, textColor } from '@/lib/models/habit';

export function icon(icon: Icon, color: Color) {
  switch (icon) {
    case 'activity':
      return <Activity className={textColor(color)} />;
    case 'alarm':
      return <AlarmPlus className={textColor(color)} />;
    case 'anchor':
      return <Anchor className={textColor(color)} />;
    case 'box':
      return <Box className={textColor(color)} />;
    case 'binary':
      return <Binary className={textColor(color)} />;
  }
}
