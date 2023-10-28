import { useState, useEffect } from 'react';

export function useDelayRender() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
  }, []);

  return { active };
}
