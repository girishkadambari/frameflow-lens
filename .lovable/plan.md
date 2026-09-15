# Clean up the FRAMEFLOW frontend

## Goal
Reorganize the current single-file frontend into clear, focused modules without changing its appearance, mock content, navigation, or interactions. Keep all data local and mock-only while creating a clean seam for a future backend service.

## Changes
- Keep `src/routes/index.tsx` as a small route definition that renders the FRAMEFLOW application.
- Move the application shell, navigation, top bar, command palette, dialogs, AI panel, and processing state into focused components.
- Group production screens by domain: overview/projects, assets, stories/scenes/shots, and continuity/history/relationships.
- Extract reusable presentation pieces such as headers, cards, information panels, timelines, and state rows.
- Centralize domain types and mock records for projects, assets, shots, navigation, and other repeated content.
- Introduce a typed frontend service contract with a mock implementation. Components will consume the mock repository instead of importing scattered data, so a real service can replace it later without adding one now.
- Format the extracted code consistently and remove unused imports, duplicate types, and avoidable inline declarations.

## Technical structure
- `src/features/frameflow/types.ts`: shared domain and navigation types.
- `src/features/frameflow/data/mock-data.ts`: immutable demo records.
- `src/features/frameflow/services/production-service.ts`: typed interface and mock implementation only.
- `src/features/frameflow/components/`: shell, shared UI, overlays, and dialogs.
- `src/features/frameflow/views/`: grouped screen components by production domain.
- `src/features/frameflow/frameflow-app.tsx`: state coordination and view selection.
- `src/routes/index.tsx`: route metadata and app entry only.

## Validation
- Confirm the existing navigation targets, dialogs, mock processing feedback, filters, and detail screens still behave the same.
- Check desktop and mobile layouts in the preview.
- Run focused type/lint checks and confirm the preview build is clean.
