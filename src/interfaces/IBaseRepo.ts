import { ObjectId } from "mongoose";

export interface IBaseRepository<T> {
    findById(id: ObjectId | string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    delete(id: string): Promise<void>;
  }