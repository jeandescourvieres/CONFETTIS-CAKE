-- Rename Staffordshire Bull Terrier (Staffie) -> Staffie

update public.contacts
set breed = 'Staffie'
where breed = 'Staffordshire Bull Terrier (Staffie)';
