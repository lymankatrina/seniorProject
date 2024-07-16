import { Request, Response, NextFunction } from 'express';
import { UsersController } from '../controllers/users';

const controller = new UsersController();

export const getUserIdFromEmail = async (req: Request) => {
  const userEmail = req.oidc.user.email;
  const user = await controller.getUserByEmail(userEmail);
  return String(user._id);
};

export function getDatesBetween(startDate: string, endDate: string): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
