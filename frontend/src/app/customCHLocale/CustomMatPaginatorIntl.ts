import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material';

/**
 * Custom swiss/german/job locale for paginator options
 */
@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {

  /**
   * Translation for 'items per page'
   */
  itemsPerPageLabel = 'Jobs pro Seite';

  /**
   * Translation for 'next page'
   */
  nextPageLabel = 'nächste Seite';

  /**
   * Translation for 'previous page'
   */
  previousPageLabel = 'vorherige Seite';

  /**
   * Return the pagination label
   * @param page Current page
   * @param pageSize Size of the pages
   * @param length Total amount of jobs
   */
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
