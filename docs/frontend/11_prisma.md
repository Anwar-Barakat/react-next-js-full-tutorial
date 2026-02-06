01. What is the difference between cuid() and uuid() in Prisma?

🟣 UUID (Universally Unique Identifier)
   ▫️ Standard 128-bit identifier format.
   ▫️ Has a native PostgreSQL type (uuid).
   ▫️ Generated using functions like gen_random_uuid().
   ▫️ Looks like: 550e8400-e29b-41d4-a716-446655440000.
   ▫️ Ideal for distributed systems with global uniqueness.
   ▫️ Can be random or time-based depending on version.

🟣 CUID (Collision-resistant Unique ID)
   ▫️ Not a built-in PostgreSQL type.
   ▫️ Stored as text or varchar.
   ▫️ Looks like: clh3qo9w80000356m2r4g7b9e.
   ▫️ Usually sortable by creation time because it starts with a timestamp.
   ▫️ More URL-friendly and slightly more human-readable.


-----------------------------------------
