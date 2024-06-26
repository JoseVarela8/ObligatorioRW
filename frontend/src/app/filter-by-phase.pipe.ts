import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByPhase'
})
export class FilterByPhasePipe implements PipeTransform {
  transform(matches: any[], searchStrings: string[]): any[] {
    if (!matches || !searchStrings || searchStrings.length === 0) {
      return matches;
    }
    return matches.filter(match => searchStrings.includes(match.group));
  }
}
