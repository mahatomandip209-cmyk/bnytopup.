# Project Rules & Custom Guidelines

- **Dynamic Database Synchronization**: Do NOT hardcode game or service ID filters on either the client-side user view or the Admin section. All game additions, edits, and deletions performed by the admin must directly update Firebase and be immediately reflected for all users.
- **Allowed Core Services**: By default, the core services only include the `Free Fire Glory Bot` (id: `ff_glorybot`). The `Free Fire Like Bot` (id: `ff_likebot`) is removed as per the user's instructions. Any additional services should be managed dynamically via the Admin panel.
