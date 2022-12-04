import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { GetBooking, PostBooking, PutBooking } from "@/controllers";
import { createEnrollmentSchema } from "@/schemas";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", GetBooking)
  .post("/",  PostBooking)
  .put("/:bookingId",  PutBooking);
export {  bookingRouter };
