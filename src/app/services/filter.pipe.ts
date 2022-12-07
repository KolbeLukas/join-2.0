import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }
        searchText = searchText.toLocaleLowerCase();

        return items.filter(task => {
            if (task.title.toLocaleLowerCase().includes(searchText) || task.description.toLocaleLowerCase().includes(searchText)) {
                return true;
            } else {
                return false;
            }
        });
    }
}