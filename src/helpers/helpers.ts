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

export const getDatesBetween = (
  startDate: string, 
  endDate: string
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  for (
    let date = new Date(start); 
    date <= end; 
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    dates.push(
      date.toISOString().split('T')[0]
    );
  }
  return dates;
};
