-- Replace {maitre} with fixed text in all animal message templates

update public.message_templates
set
  content = replace(content, '{maitre}', 'mon humain préféré'),
  title   = replace(title,   '{maitre}', 'mon humain préféré')
where animal_type is not null
  and (content like '%{maitre}%' or title like '%{maitre}%');
