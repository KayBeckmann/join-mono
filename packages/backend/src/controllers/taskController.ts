// Beispiel in src/controllers/taskController.ts
import { Request, Response } from 'express';
import { Task, TaskState } from 'shared/src/types/Task'; // Import aus shared
// import TaskModel from '../models/TaskModel'; // Dein Sequelize/Prisma Model

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    // const tasks: Task[] = await TaskModel.findAll(); // Beispiel DB Abfrage
    // res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    // Validiere req.body gegen das Task-Interface (ohne ID)
    const taskData: Omit<Task, 'id'> = req.body;
    try {
        // const newTask: Task = await TaskModel.create(taskData);
        // res.status(201).json(newTask);
    } catch (error) {
         res.status(500).json({ message: 'Error creating task', error });
    }
};
// ... weitere Controller-Funktionen ...