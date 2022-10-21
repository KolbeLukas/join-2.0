export class Task {
    title: string;
    description: string;
    category: string;
    assignedTo: string;
    dueDate: number;
    prio: string;
    id!: string;

    constructor(obj?: any) {
        this.title = obj ? obj.title : '';
        this.description = obj ? obj.description : '';
        this.category = obj ? obj.category : '';
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