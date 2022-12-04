import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import e from "express";
import httpStatus from "http-status";
import { number, object } from "joi";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createRoomWithHotelId,
  createBooking,
  createRoomWithHotelId2
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 200 and booking", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);
  
    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: booking.id,
      Room: expect.any(Object)
    });
  });
  it("should respond with status 404 if userid is false", async () => {
    const user = await createUser();
    const user2 ={
      id: 0,
      email: "asdca@adad.com",
      password: "2125",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    const token = await generateValidToken(user2);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
  it("should respond with status 404 if userid is not the user's", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const token = await generateValidToken(user2);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
  it("should respond with status 404 if booking not exist", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});

describe("Post /booking", () => {
  it("should respond with status 200 and bookingid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const beforeCount = await prisma.booking.count();
    const body={
      roomId: room.id
    };
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
    const afterCount = await prisma.booking.count();
    expect(response.status).toBe(200);
    expect(beforeCount).toEqual(0);
    expect(afterCount).toEqual(1);
    expect(response.body.id).toBeGreaterThanOrEqual(1);
  });
  it("should respond with status 404 if userid is not the user's", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const token = await generateValidToken(user2);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const beforeCount = await prisma.booking.count();
    const body={
      roomId: room.id
    };
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
    const afterCount = await prisma.booking.count();
    expect(response.status).toBe(404);
  });
  it("should respond with status 404 if userid is false", async () => {
    const user = await createUser();
    const user2 ={
      id: 0,
      email: "asdca@adad.com",
      password: "2125",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    const token = await generateValidToken(user2);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const beforeCount = await prisma.booking.count();
    const body={
      roomId: room.id
    };
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
    const afterCount = await prisma.booking.count();
    expect(response.status).toBe(404);
  });
  //a
  it("should respond with status 404 if roomid is invalid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const beforeCount = await prisma.booking.count();
    const body={
      roomId: 0
    };
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
    const afterCount = await prisma.booking.count();
    expect(response.status).toBe(404);
  });
  it("should respond with status 404 if room already booked", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const beforeCount = await prisma.booking.count();
    const body={
      roomId: room.id
    };
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
    expect(response.status).toBe(403);
  });
});
// const updatedTicket = await prisma.ticket.findUnique({ where: { id: ticket.id } });
describe("put /booking", () => {
  it("should respond with status 200 and bookingId", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const room2 = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const body={
      roomId: room2.id
    };
    const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
    const updated = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(response.status).toBe(200);
    expect(updated.roomId).toBe(room2.id);
    expect(response.body.id).toBe(booking.id);
  });
  
  it("should respond with status  404 if invalid roomId", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const token = await generateValidToken(user2);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const room2 = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const body={
      roomId: room2.id
    };
    const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
    const updated = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(response.status).toBe(404);
  });
  it("should respond with status  404 if userId not exist", async () => {
    const user = await createUser();
    const user2 ={
      id: 0,
      email: "asdca@adad.com",
      password: "2125",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    const token = await generateValidToken(user2);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const room2 = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const body={
      roomId: room2.id
    };
    const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
    const updated = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(response.status).toBe(404);
  });
  it("should respond with status  404 if roomId is invalid ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const room2 = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const body={
      roomId: room2.id
    };
    const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`).send(body);
    const updated = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(response.status).toBe(404);
  });

  it("should respond with status  404 if roomId not exis", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const room2 = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const body={
      roomId: 0
    };
    const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
    const updated = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(response.status).toBe(404);
  });
  it("should respond with status 403 if room already booked", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();
    const room = await createRoomWithHotelId(createdHotel.id);
    const room2 = await createRoomWithHotelId(createdHotel.id);
    const booking= await  createBooking(user.id, room.id);
    const booking2= await  createBooking(user.id, room2.id);
    const body={
      roomId: room2.id
    };
    const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
    const updated = await prisma.booking.findUnique({ where: { id: booking.id } });
    expect(response.status).toBe(403);
  });
});
