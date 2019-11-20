dev-tools:
  event list:
    - timestamps should be visible in more human unit:
      examples:
        + 2s 432ms
        + 1m 43s 234ms
        + 8h 23m 32s 347ms
        + 345d 9h 13m 52s 767ms

        + 2s 456ms
        + 1m 24s
        + 2h 32m
        + 234d 14h

    - Display event details:
      - JSON view of the event
      - list of aggregates impacted by this event with stats (nbr various calls)
      - for each agregate
        - JSON view of arguments of aggr call
        - JSON view of previous state
        - JSON view of result state

    - dev-tools current view stored in local/session-storage

examples:
  extract todo logic in a separated folder to share this between UI implementations
    This demonstrate the fact that with coriolis UI is just an effect
