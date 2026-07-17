# analytics-dashboard Specification

## Purpose
TBD - created by syncing change add-analytics-screen. Update Purpose after archive.

## Requirements

### Requirement: Analytics dashboard screen

The system SHALL provide an authenticated Analytics screen that fetches overall system metrics from the backend and displays a summary KPI, an hourly activity trend, and an object-detection distribution.

#### Scenario: Analytics screen loads metrics

- **WHEN** an authenticated user navigates to the Analytics screen
- **THEN** the system requests overall metrics from the backend using the standard authenticated request pattern (the same Authorization header used by other protected routes) and renders the summary KPI, hourly trend, and object distribution once the data arrives

#### Scenario: Metrics request fails

- **WHEN** the overall metrics request fails or returns an unexpected response
- **THEN** the Analytics screen displays an error state instead of partial or broken charts, without crashing the screen

#### Scenario: Metrics still loading

- **WHEN** the overall metrics request is in flight
- **THEN** the Analytics screen displays a loading state for the KPI card and charts

### Requirement: Total events summary card

The system SHALL display the total number of events across the system as a prominent KPI metric.

#### Scenario: Summary renders total events

- **WHEN** the Analytics screen successfully loads metrics whose summary reports a total event count
- **THEN** the system displays that count in a KPI card with a label identifying it as the total events figure

### Requirement: Hourly activity trend

The system SHALL visualize event counts by hour of day so users can identify peak activity periods.

#### Scenario: Hourly trend renders from heatmap data

- **WHEN** the Analytics screen successfully loads metrics containing an hourly breakdown of event counts
- **THEN** the system renders a chart with one data point per reported hour, hour-of-day on one axis and event count on the other, ordered by hour

#### Scenario: No hourly activity reported

- **WHEN** the Analytics screen successfully loads metrics whose hourly breakdown is empty
- **THEN** the system displays an explicit empty state for the hourly trend instead of an empty or broken chart

### Requirement: Object detection distribution

The system SHALL show the relative frequency of detected object types so users can see which entities are most commonly observed.

#### Scenario: Object distribution renders from metrics

- **WHEN** the Analytics screen successfully loads metrics containing per-entity detection counts
- **THEN** the system displays each entity with its count, ordered from most to least frequent

#### Scenario: No object detections reported

- **WHEN** the Analytics screen successfully loads metrics whose object distribution is empty
- **THEN** the system displays an explicit empty state for the object distribution instead of an empty or broken chart
