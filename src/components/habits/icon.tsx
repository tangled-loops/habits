import { Activity, AlarmPlus, Anchor, Binary, Box } from 'lucide-react';

import { Color, Icon, textColor } from '@/lib/models/habit';
import { cn } from '@/lib/utils';

export function icon(icon: Icon, color: Color) {
  switch (icon) {
    case 'activity':
      return <Activity className={cn(textColor(color), 'mx-2')} />;
    case 'alarm':
      return <AlarmPlus className={cn(textColor(color), 'mx-2')} />;
    case 'anchor':
      return <Anchor className={cn(textColor(color), 'mx-2')} />;
    case 'box':
      return <Box className={cn(textColor(color), 'mx-2')} />;
    case 'binary':
      return <Binary className={cn(textColor(color), 'mx-2')} />;
  }
}
