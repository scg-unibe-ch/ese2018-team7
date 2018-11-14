import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {

  itemsPerPageLabel = 'Jobs pro Seite';
  nextPageLabel = 'nächste Seite';
  previousPageLabel = 'vorherige Seite';

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${'von'} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${'von'} ${length}`;
  }

}
