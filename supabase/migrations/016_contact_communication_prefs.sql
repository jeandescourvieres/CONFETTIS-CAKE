-- Préférences de communication par contact
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS preferred_channel text
    CHECK (preferred_channel IN ('sms', 'email'))
    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS preferred_send_time text
    CHECK (preferred_send_time IN ('morning', 'afternoon', 'evening', 'anytime'))
    DEFAULT NULL;
