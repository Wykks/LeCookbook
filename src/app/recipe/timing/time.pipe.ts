import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
  transform(timeInMin: number): any {
    const hours = Math.trunc(timeInMin / 60);
    const min = timeInMin % 60;
    let str = hours ? `${hours} h ` : '';
    str += min ? `${min}` : '';
    if (!hours) {
      str += ' min';
    }
    return str;
  }
}
