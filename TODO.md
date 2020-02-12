core
  make package publishable:
    can be installed as dep for a backend project
    can be installed as dep for a front-end project
    can be used in an esmodule with webpack project
    can be used in an esmodule with rollup project
    can be used in a nodeJS native esmodule project
    can be used in a umd project
    can be used in a commonJS project
    can be loaded directly in a browser as a standalone script

  reducer projection detection can cause some errors to be invisible
    all errors in a projection-setup function would be invisible, which is a major readability/debug problem
    possible solutions:
      - disallow reducer projections
        - can be done with providing a "fromReducer" helper converting reducer to projection
      - make dev-tools display projection-setup errors (this would display falsy errors for some reducer-conversion process)


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
      - for each projection call
        - JSON view of arguments of projection call



examples:
  extract todo logic in a separated folder to share this between UI implementations
    This demonstrate the fact that with coriolis UI is just an effect
