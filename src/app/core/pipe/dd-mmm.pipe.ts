import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ddMmm'
})
export class DdMmmPipe implements PipeTransform {

  transform(value: string | Date | null | undefined): string {
    if (!value) return '-';

    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';

    // ✅ dd MMM (17 Jan)
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
  }

}
