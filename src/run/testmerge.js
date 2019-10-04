import { merge, from } from 'rxjs'

merge(
  from([1, 2, 3]),
  from([4, 5, 6]),
  from([7, 8, 9]),
  from([10, 11, 12]),
  from([13, 14, 15])
)
  .subscribe(console.log)
