import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";

async function getBooking(id: number) {
  return prisma.user.findMany({
    where: {
      id
    }, include: {
      Booking: {
        include: {
          Room: true
        }
      }
    }
  }); 
}
async function getUser(id: number) {
  return prisma.user.findMany({
    where: {
      id
    }, include: {
      Enrollment: true
    }
  }); 
}

async function postBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  }); 
}
async function GetRoom(id: number) {
  return prisma.room.findMany({
    where: {
      id
    }
  }); 
}
async function GetRoomBooking(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId
    }
  }); 
}

async function getUserBooking(id: number) {
  return prisma.booking.findMany({
    where: {
      id
    }
  }); 
}
async function PutBooking(id: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id
    },
    data: {
      roomId
    }
  }); 
}
const bookingRepository = {
  getBooking, postBooking, GetRoom, PutBooking, GetRoomBooking, getUser, getUserBooking
};
  
export default  bookingRepository;
  
