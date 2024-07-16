import { Request, Response, NextFunction } from 'express';
import { UsersController } from '../controllers/users';

const controller = new UsersController();

export const getUserIdFromEmail = async (req: Request) => {
  const userEmail = req.oidc.user.email;
  const user = await controller.getUserByEmail(userEmail);
  return String(user._id);
};

export const getDatesBetween = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};
