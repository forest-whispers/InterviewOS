export interface DomainEventMap {
    "event.[any].created": {}
}

export type DomainEventName = keyof DomainEventMap;