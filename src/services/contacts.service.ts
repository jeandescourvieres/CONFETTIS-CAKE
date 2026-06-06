import * as ExpoContacts from 'expo-contacts';
import { supabase } from './supabase';
import { getNameDayForName } from '../utils/namedays';
import type { Contact, Relation } from '../types/models';

// ── CRUD Supabase ─────────────────────────────

export async function fetchContacts(userId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error) throw error;
  return (data ?? []) as Contact[];
}

export async function fetchContact(id: string): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Contact;
}

export async function createContact(
  userId: string,
  input: Omit<Contact, 'id' | 'user_id' | 'created_at'>,
): Promise<Contact> {
  // Auto-détecter la fête du prénom si non fournie
  const firstName = input.name.split(' ')[0];
  const name_day = input.name_day ?? getNameDayForName(firstName);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('contacts') as any)
    .insert({ ...input, user_id: userId, name_day })
    .select()
    .single();
  if (error) throw error;
  return data as Contact;
}

export async function updateContact(
  id: string,
  updates: Partial<Omit<Contact, 'id' | 'user_id' | 'created_at'>>,
): Promise<Contact> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('contacts') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Contact;
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
}

// ── Import téléphone ──────────────────────────

export interface PhoneContactCandidate {
  /** ID natif du contact téléphone */
  phoneId: string;
  name: string;
  phone: string | null;
  email: string | null;
  birthday: string | null; // "YYYY-MM-DD"
  avatarUri: string | null;
}

/**
 * Demande la permission et retourne la liste des contacts téléphone
 * qui ont au moins un nom.
 */
export async function fetchPhoneContacts(): Promise<PhoneContactCandidate[]> {
  const { status } = await ExpoContacts.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission contacts refusée');
  }

  const { data } = await ExpoContacts.getContactsAsync({
    fields: [
      ExpoContacts.Fields.Name,
      ExpoContacts.Fields.PhoneNumbers,
      ExpoContacts.Fields.Emails,
      ExpoContacts.Fields.Birthday,
      ExpoContacts.Fields.Image,
    ],
    sort: ExpoContacts.SortTypes.FirstName,
  });

  return (data ?? [])
    .filter((c) => c.name)
    .map((c) => ({
      phoneId: c.id ?? '',
      name: c.name ?? '',
      phone: c.phoneNumbers?.[0]?.number ?? null,
      email: c.emails?.[0]?.email ?? null,
      birthday: parseBirthday(c.birthday),
      avatarUri: c.imageAvailable && c.image?.uri ? c.image.uri : null,
    }));
}

/**
 * Importe une sélection de contacts téléphone dans Supabase.
 * Retourne le nombre de contacts importés.
 */
export async function importPhoneContacts(
  userId: string,
  candidates: PhoneContactCandidate[],
): Promise<number> {
  if (candidates.length === 0) return 0;

  const rows = candidates.map((c) => ({
    user_id: userId,
    name: c.name,
    phone: c.phone,
    email: c.email,
    birthday: c.birthday,
    name_day: c.birthday
      ? null
      : getNameDayForName(c.name.split(' ')[0]),
    relation: 'friend' as Relation,
    imported_from: 'phone' as const,
    avatar_url: c.avatarUri,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error, count } = await (supabase.from('contacts') as any)
    .insert(rows)
    .select('id');

  if (error) throw error;
  return count ?? rows.length;
}

// ── Interaction ───────────────────────────────

export async function incrementContactInteraction(contactId: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)('increment_contact_interaction', { p_contact_id: contactId });
}

// ── Upload avatar ─────────────────────────────

export async function uploadContactAvatar(localUri: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  // XHR arraybuffer — plus fiable que fetch().blob() sur Android
  const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', localUri);
    xhr.responseType = 'arraybuffer';
    xhr.onload  = () => resolve(xhr.response as ArrayBuffer);
    xhr.onerror = () => reject(new Error('Lecture du fichier image échouée'));
    xhr.send();
  });

  const lower = localUri.toLowerCase();
  const ext = lower.includes('.png') ? 'png' : lower.includes('.webp') ? 'webp' : 'jpg';
  const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('contact-avatars')
    .upload(path, arrayBuffer, { contentType, upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('contact-avatars')
    .getPublicUrl(data.path);

  return publicUrl;
}

// ── Helpers privés ────────────────────────────

function parseBirthday(
  birthday: { year?: number; month?: number; day?: number } | undefined,
): string | null {
  if (!birthday) return null;
  const { year, month, day } = birthday;
  if (!month || !day) return null;
  // iOS stocke les anniversaires sans année avec year=0 ou year=1 (à ignorer)
  const validYear = year && year > 1 ? year : null;
  const y = validYear ?? new Date().getFullYear();
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  // On stocke l'année réelle si connue, sinon on préfixe par "0000" pour signaler l'absence
  return validYear ? `${y}-${mm}-${dd}` : `0000-${mm}-${dd}`;
}
