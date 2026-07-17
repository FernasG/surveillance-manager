## MODIFIED Requirements

### Requirement: Sidebar navigation entries

The system SHALL let the user switch between authenticated sections (Home, Video Archive, Semantic Search, Analytics) by selecting entries in the sidebar, without a full page reload of the shell.

#### Scenario: User navigates to Video Archive from Home

- **WHEN** a user on the Home screen selects the "Video Archive" entry in the sidebar
- **THEN** the system displays the Video Archive gallery within the same shell, and the sidebar indicates "Video Archive" as the active entry

#### Scenario: User navigates back to Home

- **WHEN** a user on the Video Archive screen selects the "Home" entry in the sidebar
- **THEN** the system displays the Home screen within the same shell, and the sidebar indicates "Home" as the active entry

#### Scenario: User navigates to Semantic Search

- **WHEN** a user on any authenticated screen selects the "Semantic Search" entry in the sidebar
- **THEN** the system displays the Semantic Search section within the same shell, and the sidebar indicates "Semantic Search" as the active entry

#### Scenario: User navigates to Analytics

- **WHEN** a user on any authenticated screen selects the "Analytics" entry in the sidebar
- **THEN** the system displays the Analytics dashboard within the same shell, and the sidebar indicates "Analytics" as the active entry

#### Scenario: User navigates back to Home from Analytics

- **WHEN** a user on the Analytics screen selects the "Home" entry in the sidebar
- **THEN** the system displays the Home screen within the same shell, and the sidebar indicates "Home" as the active entry
