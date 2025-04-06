import { FilterQuery, Model, ObjectId } from 'mongoose';
import { IBaseRepository } from '../interfaces/IBaseRepo';

export class BaseRepository<T> implements IBaseRepository<T> {
  private _model: any;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async findById(id: ObjectId | string): Promise<T | null> {
    try {
      return this._model.findById(id).exec();
    } catch (error) {
      console.error('Error find', error);
      return null;
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return this._model.findOne(filter).exec();
    } catch (error) {
      console.error('Error find user', error);
      return null;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return this._model.find().exec();
    } catch (error) {
      console.error('Error find users', error);
      throw new Error('Error find users');
    }
  }

  async create(entity: T): Promise<T> {
    try {
      const newEntity = new this._model(entity);
      return newEntity.save();
    } catch (error) {
      console.error('Error create', error);
      throw new Error('Error create');
    }
  }

  async update(entity: any): Promise<T> {
    return this._model.findByIdAndUpdate(entity._id, entity, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this._model.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }
}
