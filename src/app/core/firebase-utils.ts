// https://github.com/angular/angularfire/issues/2012
// Workaround issue with valueChanges to make sure first data are complete instead of partial cached data
// Basically use .get() behavior for the first result instead of valueChanges

import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

export function queryCollection<T extends { id: string; updatedAt: string }>(
  db: AngularFirestore,
  path: string,
  queryFn?: QueryFn
): Observable<T[]> {
  return db
    .collection<T>(path, (ref) => {
      const q = queryFn ? queryFn(ref) : ref;
      return q.orderBy('updatedAt', 'desc');
    })
    .get()
    .pipe(
      switchMap((res) => {
        return db
          .collection<T>(path, (ref) => {
            const q = queryFn ? queryFn(ref) : ref;
            return q
              .orderBy('updatedAt', 'desc')
              .startAt((<T>res.docs[0].data()).updatedAt);
          })
          .valueChanges({ idField: 'id' })
          .pipe(
            startWith(
              res.docs.map((doc) => ({
                id: doc.id,
                ...(<T>doc.data()),
              }))
            )
          );
      })
    );
}
