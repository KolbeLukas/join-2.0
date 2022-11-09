export class Task {
    title: string;
    description: string;
    category: string;
    categoryColor: string;
    assignedTo: any;
    dueDate: any;
    prio: string;
    state = 'todo';
    id!: string;
    contacts: any;

    constructor(obj?: any) {
        this.title = obj ? obj.title : '';
        this.description = obj ? obj.description : '';
        this.category = obj ? obj.category : '';
        this.categoryColor = obj ? obj.categoryColor : '';
        this.assignedTo = obj ? obj.assignedTo : '';
        this.dueDate = obj ? obj.dueDate : '';
        this.prio = obj ? obj.prio : '';
    }

    public toJSON() {
        return {
            title: this.title,
            description: this.description,
            category: this.category,
            assignedTo: this.assignedTo,
            dueDate: this.dueDate,
            prio: this.prio
        }
    }
}