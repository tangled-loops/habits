select
  habits.name,
  count(habits.name) as responded,
  max(habits.goal) as goal,
  round((count(habits.name)::numeric(30, 20) / max(habits.goal)::numeric(30, 20)), 2) as percent,
  extract(DOY from responses.created_at) as doy, 
  extract(YEAR from responses.created_at) as year
from responses
left join habits on responses.habit_id = habits.id
group by doy, year, habits.name
order by doy;