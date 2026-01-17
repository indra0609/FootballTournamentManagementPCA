import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortName'
})
export class ShortNamePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    const words = value
      .trim()
      .split(' ')
      .filter(w => w.length > 0);

    if (words.length === 0) return '';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

    // ✅ "Sona Moi" => SM
    // ✅ "Ram Sam Jadu" => RSJ
    return words.map(w => w[0].toUpperCase()).join('');
  }

}
