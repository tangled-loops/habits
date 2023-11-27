import { Activity, AlarmPlus, Anchor, Binary, Box } from 'lucide-react';

import { Color, Icon, textColor } from '@/lib/models/habit';
import { cn } from '@/lib/utils';

export function icon(icon: Icon, color: Color) {
  const classes = cn(textColor(color), 'mx-2');
  switch (icon) {
    case 'activity':
      return <Activity className={classes} />;
    case 'alarm':
      return <AlarmPlus className={classes} />;
    case 'anchor':
      return <Anchor className={classes} />;
    case 'box':
      return <Box className={classes} />;
    case 'binary':
      return <Binary className={classes} />;
  }
}
