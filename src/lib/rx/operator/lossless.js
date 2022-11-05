import { Observable } from "rxjs";

export const lossless = (source) => {
  const buffer = [];
  let error;
  let completed = false;
  let bufferSubscription;
  let subscriptionsCount = 0;

  const bufferize = () => {
    bufferSubscription = source.subscribe(
      (event) => buffer.push(event),
      (err) => {
        error = err;
      },
      () => {
        completed = true;
      },
    );
  };

  bufferize();

  return new Observable((observer) => {
    let subscription;

    if (error) {
      observer.error(error);
    } else if (completed) {
      observer.complete();
    } else {
      subscription = source.subscribe(observer);
      subscriptionsCount += 1;
    }

    if (bufferSubscription) {
      const eventsToReplay = buffer.slice();
      bufferSubscription.unsubscribe();

      // flushes initial subscription
      bufferSubscription = undefined;
      // flushes events buffer
      buffer.length = 0;
      error = undefined;
      completed = false;

      // ⚠ event playback must happen after observer subscription and buffer unsubscription are done
      eventsToReplay.forEach((event) => observer.next(event));
    }

    return () => {
      if (!subscription) {
        return;
      }

      subscription.unsubscribe();
      subscription = undefined;
      subscriptionsCount -= 1;

      if (subscriptionsCount === 0) {
        bufferize();
      }
    };
  });
};
