import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export const getUserIdFromEmail = async (
  req: Request
): Promise<ObjectId> => {
  const authUser = req.oidc?.user;
  if (!authUser?.email) {
    throw new Error('User information not available');
  }
  const user = await collections.users.findOne({
    email: authUser.email
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user._id;
};

export function getDatesBetween(
  startDate: string, 
  endDate: string
): Date[] {
  const dates: Date[] = [];

  const currentDate = new Date(`${startDate}T00:00:00Z`);
  const lastDate = new Date(`${endDate}T00:00:00Z`);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
}
