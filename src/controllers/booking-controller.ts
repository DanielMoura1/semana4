import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function GetBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const Booking = await bookingService.getBooking(userId);
    console.log("booking");
    return res.status(httpStatus.OK).send(Booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
export async function PostBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    const Booking = await bookingService.postBooking(userId, roomId);
    console.log("booking");
    return res.status(httpStatus.OK).send({ id: Booking.id });
  } catch (error) {
    if (error.name === "RequestError") {
      return res.sendStatus(403);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
export async function PutBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;
  try {
    const Booking = await bookingService.putBooking(userId, roomId, Number(bookingId));
    return res.status(httpStatus.OK).send({ id: Booking.id });
  } catch (error) {
    if (error.name === "RequestError") {
      return res.sendStatus(403);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
  
