import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertEventSchema,
  insertTicketSchema,
  insertRegistrationSchema,
  eventFormSchema
} from "@shared/schema";
import { translateText, translateWithCache, supportedLanguages } from "./translation";
import * as bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  app.use(
    session({
      secret: "eventHub-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 86400000 }, // 24 hours
      store: new SessionStore({ checkPeriod: 86400000 })
    })
  );

  // User Authentication Middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // AUTH ROUTES
  
  // Registration
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Save user ID in session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Save user ID in session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // CATEGORY ROUTES
  
  // Get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get category by ID
  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get category by slug
  app.get("/api/categories/slug/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      const category = await storage.getCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // EVENT ROUTES
  
  // Get all events
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string || '';
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const location = req.query.location as string;
      const price = req.query.price as string;
      const isVirtual = req.query.isVirtual !== undefined ? 
        (req.query.isVirtual === 'true') : undefined;
      
      let priceFilter: 'free' | 'paid' | undefined;
      if (price === 'free') priceFilter = 'free';
      if (price === 'paid') priceFilter = 'paid';
      
      const filters = {
        categoryId,
        startDate,
        endDate,
        location,
        price: priceFilter,
        isVirtual
      };
      
      const events = await storage.searchEvents(search, filters);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get featured events
  app.get("/api/events/featured", async (_req: Request, res: Response) => {
    try {
      const events = await storage.getFeaturedEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get events by category
  app.get("/api/events/category/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const events = await storage.getEventsByCategory(id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get events by organizer
  app.get("/api/events/organizer/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid organizer ID" });
      }
      
      const events = await storage.getEventsByOrganizer(id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get event by ID with details
  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEventWithDetails(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Create event
  app.post("/api/events", requireAuth, async (req: Request, res: Response) => {
    try {
      const eventData = eventFormSchema.parse(req.body);
      const userId = req.session.userId!;
      
      // Create event
      const event = await storage.createEvent({
        ...eventData,
        organizerId: userId
      });
      
      // Create tickets for the event
      if (eventData.tickets && eventData.tickets.length > 0) {
        for (const ticketData of eventData.tickets) {
          await storage.createTicket({
            ...ticketData,
            eventId: event.id,
            available: ticketData.quantity
          });
        }
      }
      
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Update event
  app.put("/api/events/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // Check if event exists and user is the organizer
      const existingEvent = await storage.getEventById(id);
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (existingEvent.organizerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to update this event" });
      }
      
      const eventData = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(id, eventData);
      
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Delete event
  app.delete("/api/events/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // Check if event exists and user is the organizer
      const existingEvent = await storage.getEventById(id);
      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (existingEvent.organizerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to delete this event" });
      }
      
      await storage.deleteEvent(id);
      
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // TICKET ROUTES
  
  // Get tickets for an event
  app.get("/api/events/:eventId/tickets", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const tickets = await storage.getTicketsByEvent(eventId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Create ticket
  app.post("/api/tickets", requireAuth, async (req: Request, res: Response) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      
      // Check if event exists and user is the organizer
      const event = await storage.getEventById(ticketData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.organizerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to create tickets for this event" });
      }
      
      const ticket = await storage.createTicket({
        ...ticketData,
        available: ticketData.quantity
      });
      
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // TRANSLATION ROUTES

  // Get supported languages
  app.get("/api/translations/languages", async (_req: Request, res: Response) => {
    try {
      res.json(supportedLanguages);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Translate text
  app.post("/api/translations/translate", async (req: Request, res: Response) => {
    try {
      const { text, targetLanguage, sourceLanguage = 'en' } = req.body;
      
      if (!text || !targetLanguage) {
        return res.status(400).json({ message: "Text and target language are required" });
      }
      
      // Check if target language is supported
      const isLanguageSupported = supportedLanguages.some(lang => lang.code === targetLanguage);
      if (!isLanguageSupported) {
        return res.status(400).json({ message: "Unsupported target language" });
      }
      
      // If it's an array of strings
      if (Array.isArray(text)) {
        const translatedTexts = await translateText(text, targetLanguage, sourceLanguage);
        return res.json({ translatedText: translatedTexts });
      }
      
      // If it's a single string
      const translatedText = await translateWithCache(text, targetLanguage, sourceLanguage);
      res.json({ translatedText });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ message: "Translation error" });
    }
  });
  
  // Translate object fields
  app.post("/api/translations/translate-object", async (req: Request, res: Response) => {
    try {
      const { object, targetLanguage, sourceLanguage = 'en', fields } = req.body;
      
      if (!object || !targetLanguage) {
        return res.status(400).json({ message: "Object and target language are required" });
      }
      
      // Check if target language is supported
      const isLanguageSupported = supportedLanguages.some(lang => lang.code === targetLanguage);
      if (!isLanguageSupported) {
        return res.status(400).json({ message: "Unsupported target language" });
      }
      
      // Clone the object to avoid modifying the original
      const result = { ...object };
      
      // If specific fields are provided, only translate those
      if (Array.isArray(fields) && fields.length > 0) {
        const textsToTranslate: string[] = [];
        const fieldsToTranslate: string[] = [];
        
        for (const field of fields) {
          if (field in object && typeof object[field] === 'string' && object[field]) {
            textsToTranslate.push(object[field]);
            fieldsToTranslate.push(field);
          }
        }
        
        if (textsToTranslate.length > 0) {
          const translatedTexts = await translateText(textsToTranslate, targetLanguage, sourceLanguage) as string[];
          
          fieldsToTranslate.forEach((field, index) => {
            result[field] = translatedTexts[index];
          });
        }
      } 
      // Otherwise translate all string fields
      else {
        const textsToTranslate: string[] = [];
        const fieldsToTranslate: string[] = [];
        
        for (const key in object) {
          if (typeof object[key] === 'string' && object[key]) {
            textsToTranslate.push(object[key]);
            fieldsToTranslate.push(key);
          }
        }
        
        if (textsToTranslate.length > 0) {
          const translatedTexts = await translateText(textsToTranslate, targetLanguage, sourceLanguage) as string[];
          
          fieldsToTranslate.forEach((field, index) => {
            result[field] = translatedTexts[index];
          });
        }
      }
      
      res.json({ translatedObject: result });
    } catch (error) {
      console.error('Object translation error:', error);
      res.status(500).json({ message: "Translation error" });
    }
  });

  // REGISTRATION ROUTES
  
  // Register for an event
  app.post("/api/registrations", requireAuth, async (req: Request, res: Response) => {
    try {
      const registrationData = insertRegistrationSchema.parse(req.body);
      const userId = req.session.userId!;
      
      // Validate ticket and availability
      const ticket = await storage.getTicketById(registrationData.ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      if (ticket.available < registrationData.quantity) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }
      
      // Create registration
      const registration = await storage.createRegistration({
        ...registrationData,
        userId
      });
      
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  
  // Get user registrations
  app.get("/api/registrations/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      const registrations = await storage.getUserRegistrations(userId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get registrations for an event (organizer only)
  app.get("/api/events/:eventId/registrations", requireAuth, async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // Check if user is the organizer
      const event = await storage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      if (event.organizerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to view registrations for this event" });
      }
      
      const registrations = await storage.getRegistrationsByEvent(eventId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
