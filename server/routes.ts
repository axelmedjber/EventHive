import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertEventSchema, 
  insertTicketTypeSchema, 
  insertRegistrationSchema, 
  userSignupSchema, 
  eventCreationSchema,
  ticketPurchaseSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

function handleZodError(err: unknown, res: Response) {
  if (err instanceof ZodError) {
    const validationError = fromZodError(err);
    return res.status(400).json({ message: validationError.message });
  }
  return res.status(500).json({ message: "An unexpected error occurred" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Health check endpoint
  router.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // User routes
  router.post("/users/signup", async (req, res) => {
    try {
      const userData = userSignupSchema.parse(req.body);
      const { confirmPassword, ...insertUserData } = userData;
      
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(insertUserData);
      // Don't send password back
      const { password, ...userResponse } = user;
      
      res.status(201).json(userResponse);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  router.post("/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Don't send password back
      const { password: _, ...userResponse } = user;
      
      res.status(200).json(userResponse);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  router.get("/users/profile/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password back
      const { password, ...userResponse } = user;
      
      res.status(200).json(userResponse);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  // Category routes
  router.get("/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  // Event routes
  router.get("/events", async (req, res) => {
    try {
      const { categoryId, search, startDate, location, featured } = req.query;
      
      const filters: {
        categoryId?: number;
        search?: string;
        startDate?: Date;
        location?: string;
        featured?: boolean;
      } = {};
      
      if (categoryId) filters.categoryId = parseInt(categoryId as string);
      if (search) filters.search = search as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (location) filters.location = location as string;
      if (featured !== undefined) filters.featured = featured === "true";
      
      const events = await storage.getEvents(filters);
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  router.get("/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEventWithDetails(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  router.get("/events/organizer/:id", async (req, res) => {
    try {
      const organizerId = parseInt(req.params.id);
      
      if (isNaN(organizerId)) {
        return res.status(400).json({ message: "Invalid organizer ID" });
      }
      
      const events = await storage.getEventsByOrganizer(organizerId);
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  router.post("/events", async (req, res) => {
    try {
      const eventData = eventCreationSchema.parse(req.body);
      
      // Validate that the organizer exists
      const organizer = await storage.getUser(eventData.organizerId);
      if (!organizer) {
        return res.status(404).json({ message: "Organizer not found" });
      }
      
      // Validate that the category exists
      const category = await storage.getCategory(eventData.categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  router.put("/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const eventData = insertEventSchema.partial().parse(req.body);
      
      // Check if event exists
      const existingEvent = await storage.getEvent(eventId);
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Validate dates if they are being updated
      if (eventData.startDate && eventData.endDate) {
        if (new Date(eventData.endDate) < new Date(eventData.startDate)) {
          return res.status(400).json({ message: "End date must be after start date" });
        }
      } else if (eventData.startDate && existingEvent.endDate) {
        if (new Date(existingEvent.endDate) < new Date(eventData.startDate)) {
          return res.status(400).json({ message: "End date must be after start date" });
        }
      } else if (eventData.endDate && existingEvent.startDate) {
        if (new Date(eventData.endDate) < new Date(existingEvent.startDate)) {
          return res.status(400).json({ message: "End date must be after start date" });
        }
      }
      
      const updatedEvent = await storage.updateEvent(eventId, eventData);
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.status(200).json(updatedEvent);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  router.delete("/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const success = await storage.deleteEvent(eventId);
      
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  // Ticket routes
  router.get("/events/:id/tickets", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const ticketTypes = await storage.getTicketTypes(eventId);
      res.status(200).json(ticketTypes);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  router.post("/events/:id/tickets", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      const ticketData = insertTicketTypeSchema.parse(req.body);
      
      // Ensure ticket is for this event
      if (ticketData.eventId !== eventId) {
        return res.status(400).json({ message: "Ticket eventId does not match URL" });
      }
      
      const ticketType = await storage.createTicketType(ticketData);
      res.status(201).json(ticketType);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Registration routes
  router.get("/events/:id/registrations", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const registrations = await storage.getRegistrations(eventId);
      res.status(200).json(registrations);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  router.get("/users/:id/registrations", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const registrations = await storage.getRegistrationsByUser(userId);
      res.status(200).json(registrations);
    } catch (err) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  router.post("/events/:id/register", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const registrationData = ticketPurchaseSchema.parse(req.body);
      
      // Ensure registration is for this event
      if (registrationData.eventId !== eventId) {
        return res.status(400).json({ message: "Registration eventId does not match URL" });
      }
      
      // Check if event exists
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if ticket type exists
      const ticketType = await storage.getTicketType(registrationData.ticketTypeId);
      if (!ticketType) {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      
      // Check if ticket belongs to event
      if (ticketType.eventId !== eventId) {
        return res.status(400).json({ message: "Ticket does not belong to this event" });
      }
      
      // Check if ticket is available
      if (ticketType.quantity < registrationData.quantity) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }
      
      // Create registration
      const registration = await storage.createRegistration(registrationData);
      res.status(201).json(registration);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Register API routes
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
