export declare enum TaskState {
    ToDo = "ToDo",
    InProgress = "progress",// Namen aus altem Code beibehalten
    AwaitingFeedback = "awaiting",
    Done = "done"
}
export declare enum TaskPriority {
    Urgent = -1,
    Medium = 0,
    Low = 1
}
export interface Subtask {
    id?: number | string;
    description: string;
    done: boolean;
}
export interface Category {
    id: number | string;
    name: string;
    color: string;
}
export interface Task {
    id: number | string;
    title: string;
    description: string;
    priority: TaskPriority;
    category: Category;
    assignedTo: Array<number | string>;
    dueDate: number;
    state: TaskState;
    subtask: Subtask[];
}
