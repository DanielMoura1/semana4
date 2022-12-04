import { AddressEnrollment } from "@/protocols";
import { getAddress } from "@/utils/cep-service";
import { notFoundError, requestError } from "@/errors";
import addressRepository, { CreateAddressParams } from "@/repositories/address-repository";
import bookingRepository from "@/repositories/booking-repository";
import { exclude } from "@/utils/prisma-utils";
import { Address, Enrollment } from "@prisma/client";

async function getBooking(id: number) {
  const user= await bookingRepository.getBooking(id);
  if(user.length===0 ||user[0].Booking.length===0) {
    throw notFoundError();
  }
  const res ={
    id: user[0].Booking[0].id,
    Room: user[0].Booking[0].Room
  };
  return res; 
}
async function postBooking(userId: number, roomId: number) {
  const room = await bookingRepository.GetRoom(roomId);
  if(room.length===0) {
    throw notFoundError();
  }
  const reserva = await bookingRepository.GetRoomBooking(roomId);
  if(reserva.length>0) {
    throw requestError(403, "Forbidden");
  }
  const id = await bookingRepository.getUser(userId);
  if(id[0].Enrollment.length===0 || id.length===0) {
    throw notFoundError();
  }
  const Booking= await bookingRepository.postBooking(userId, roomId);
  return Booking;
}
async function putBooking(userId: number, roomId: number, bookingId: number) {
  const room = await bookingRepository.GetRoom(roomId);
  if(room.length===0) {
    throw notFoundError();
  }
  const reserva = await bookingRepository.GetRoomBooking(roomId);
  if(reserva.length>0) {
    throw requestError(403, "Forbidden");
  }
  const idVerification = await bookingRepository.getUserBooking(bookingId);
  if(userId !==idVerification[0].userId) {
    throw notFoundError();
  }
  const Booking= await bookingRepository.PutBooking(bookingId, roomId);
  return  Booking;
}

const bookingService = {
  getBooking, postBooking, putBooking
};
  
export default bookingService;
  
