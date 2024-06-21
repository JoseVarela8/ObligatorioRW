import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByPhase'
})
export class FilterByPhasePipe implements PipeTransform {
  transform(matches: any[], searchString: string): any[] {
    if (!matches || !searchString) {
      return matches;
    }
    return matches.filter(match => match.group.includes(searchString));
  }
}
