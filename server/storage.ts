import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  events, type Event, type InsertEvent,
  tickets, type Ticket, type InsertTicket,
  registrations, type Registration, type InsertRegistration,
  type EventWithDetails, type UserWithEvents
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventsByCategory(categoryId: number): Promise<Event[]>;
  getEventsByOrganizer(organizerId: number): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  searchEvents(query: string, filters?: EventFilters): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  getEventWithDetails(id: number): Promise<EventWithDetails | undefined>;
  
  // Ticket operations
  getTicketsByEvent(eventId: number): Promise<Ticket[]>;
  getTicketById(id: number): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  
  // Registration operations
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
  getRegistrationsByUser(userId: number): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrationById(id: number): Promise<Registration | undefined>;
  getUserRegistrations(userId: number): Promise<Registration[]>;
}

export type EventFilters = {
  categoryId?: number;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  price?: 'free' | 'paid' | number[];
  isVirtual?: boolean;
};

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private events: Map<number, Event>;
  private tickets: Map<number, Ticket>;
  private registrations: Map<number, Registration>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private eventIdCounter: number;
  private ticketIdCounter: number;
  private registrationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.events = new Map();
    this.tickets = new Map();
    this.registrations = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.eventIdCounter = 1;
    this.ticketIdCounter = 1;
    this.registrationIdCounter = 1;
    
    // Initialize with some default categories
    this.seedCategories();
  }

  // Seed initial categories
  private seedCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Music", slug: "music", icon: "music" },
      { name: "Food & Drink", slug: "food-drink", icon: "utensils" },
      { name: "Technology", slug: "technology", icon: "laptop" },
      { name: "Arts", slug: "arts", icon: "palette" },
      { name: "Sports", slug: "sports", icon: "running" },
      { name: "Business", slug: "business", icon: "briefcase" }
    ];
    
    defaultCategories.forEach(category => this.createCategory(category));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getEventsByCategory(categoryId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      event => event.categoryId === categoryId
    );
  }
  
  async getEventsByOrganizer(organizerId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      event => event.organizerId === organizerId
    );
  }
  
  async getFeaturedEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      event => event.isFeatured
    );
  }
  
  async searchEvents(query: string, filters?: EventFilters): Promise<Event[]> {
    let results = Array.from(this.events.values());
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(event => 
        event.title.toLowerCase().includes(lowerQuery) || 
        event.description.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply additional filters if provided
    if (filters) {
      if (filters.categoryId) {
        results = results.filter(event => event.categoryId === filters.categoryId);
      }
      
      if (filters.startDate) {
        results = results.filter(event => new Date(event.startDate) >= filters.startDate!);
      }
      
      if (filters.endDate) {
        results = results.filter(event => new Date(event.startDate) <= filters.endDate!);
      }
      
      if (filters.location) {
        const lowerLocation = filters.location.toLowerCase();
        results = results.filter(event => 
          event.location.toLowerCase().includes(lowerLocation)
        );
      }
      
      if (filters.isVirtual !== undefined) {
        results = results.filter(event => event.isVirtual === filters.isVirtual);
      }
      
      if (filters.price === 'free' || filters.price === 'paid') {
        const eventIds = Array.from(this.tickets.values())
          .filter(ticket => {
            if (filters.price === 'free') return ticket.price === 0;
            if (filters.price === 'paid') return ticket.price > 0;
            return true;
          })
          .map(ticket => ticket.eventId);
        
        results = results.filter(event => eventIds.includes(event.id));
      }
    }
    
    return results;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const createdAt = new Date();
    const event: Event = { ...insertEvent, id, createdAt };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent = { ...existingEvent, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
  
  async getEventWithDetails(id: number): Promise<EventWithDetails | undefined> {
    const event = await this.getEventById(id);
    if (!event) return undefined;
    
    const organizer = await this.getUser(event.organizerId);
    const category = await this.getCategoryById(event.categoryId);
    const tickets = await this.getTicketsByEvent(id);
    const registrations = await this.getRegistrationsByEvent(id);
    
    if (!organizer || !category) return undefined;
    
    return {
      ...event,
      organizer,
      category,
      tickets,
      registrationsCount: registrations.length
    };
  }

  // Ticket operations
  async getTicketsByEvent(eventId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      ticket => ticket.eventId === eventId
    );
  }

  async getTicketById(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const ticket: Ticket = { ...insertTicket, id };
    this.tickets.set(id, ticket);
    return ticket;
  }
  
  async updateTicket(id: number, ticketUpdate: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const existingTicket = this.tickets.get(id);
    if (!existingTicket) return undefined;
    
    const updatedTicket = { ...existingTicket, ...ticketUpdate };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  // Registration operations
  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      registration => registration.eventId === eventId
    );
  }

  async getRegistrationsByUser(userId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      registration => registration.userId === userId
    );
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = this.registrationIdCounter++;
    const createdAt = new Date();
    const registration: Registration = { ...insertRegistration, id, createdAt };
    
    // Update ticket availability
    const ticket = await this.getTicketById(registration.ticketId);
    if (ticket && ticket.available >= registration.quantity) {
      const updatedAvailable = ticket.available - registration.quantity;
      await this.updateTicket(ticket.id, { available: updatedAvailable });
    }
    
    this.registrations.set(id, registration);
    return registration;
  }
  
  async getRegistrationById(id: number): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }
  
  async getUserRegistrations(userId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      registration => registration.userId === userId
    );
  }
}

export const storage = new MemStorage();
