# app-shell-navigation Specification

## Purpose
TBD - created by archiving change add-video-archive-dashboard. Update Purpose after archive.

## Requirements

### Requirement: Retractable sidebar navigation

The system SHALL provide a sidebar, anchored to the left edge of authenticated screens, that lists navigation entries (including Home and Video Archive) and can be toggled between an expanded and a collapsed (icon-only) state via a control in the sidebar's corner.

#### Scenario: Sidebar starts expanded

- **WHEN** an authenticated user visits an authenticated screen for the first time (no stored preference)
- **THEN** the sidebar renders in its expanded state, showing labels alongside navigation entries

#### Scenario: User collapses the sidebar

- **WHEN** a user activates the sidebar's collapse control while it is expanded
- **THEN** the sidebar transitions to its collapsed, icon-only state and the main content area reflows to use the reclaimed width

#### Scenario: User expands the sidebar

- **WHEN** a user activates the sidebar's toggle control while it is collapsed
- **THEN** the sidebar transitions back to its expanded state showing labels

#### Scenario: Collapse state persists across reloads

- **WHEN** a user reloads the app after collapsing (or expanding) the sidebar
- **THEN** the sidebar renders in the same state it was left in

### Requirement: Sidebar navigation entries

The system SHALL let the user switch between authenticated sections (Home, Video Archive, Semantic Search) by selecting entries in the sidebar, without a full page reload of the shell.

#### Scenario: User navigates to Video Archive from Home

- **WHEN** a user on the Home screen selects the "Video Archive" entry in the sidebar
- **THEN** the system displays the Video Archive gallery within the same shell, and the sidebar indicates "Video Archive" as the active entry

#### Scenario: User navigates back to Home

- **WHEN** a user on the Video Archive screen selects the "Home" entry in the sidebar
- **THEN** the system displays the Home screen within the same shell, and the sidebar indicates "Home" as the active entry

#### Scenario: User navigates to Semantic Search

- **WHEN** a user on any authenticated screen selects the "Semantic Search" entry in the sidebar
- **THEN** the system displays the Semantic Search section within the same shell, and the sidebar indicates "Semantic Search" as the active entry
