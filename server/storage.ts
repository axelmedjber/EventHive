import {
  users, categories, events, ticketTypes, registrations,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Event, type InsertEvent, type EventWithDetails,
  type TicketType, type InsertTicketType,
  type Registration, type InsertRegistration, type RegistrationWithDetails
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Category management
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Event management
  getEvents(filters?: {
    categoryId?: number;
    search?: string;
    startDate?: Date;
    location?: string;
    featured?: boolean;
  }): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getEventWithDetails(id: number): Promise<EventWithDetails | undefined>;
  getEventsByOrganizer(organizerId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Ticket management
  getTicketTypes(eventId: number): Promise<TicketType[]>;
  getTicketType(id: number): Promise<TicketType | undefined>;
  createTicketType(ticketType: InsertTicketType): Promise<TicketType>;
  updateTicketType(id: number, ticketType: Partial<InsertTicketType>): Promise<TicketType | undefined>;
  
  // Registration management
  getRegistrations(eventId: number): Promise<Registration[]>;
  getRegistrationsByUser(userId: number): Promise<RegistrationWithDetails[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  updateRegistrationStatus(id: number, status: string): Promise<Registration | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private events: Map<number, Event>;
  private ticketTypes: Map<number, TicketType>;
  private registrations: Map<number, Registration>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private eventCurrentId: number;
  private ticketTypeCurrentId: number;
  private registrationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.events = new Map();
    this.ticketTypes = new Map();
    this.registrations = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.eventCurrentId = 1;
    this.ticketTypeCurrentId = 1;
    this.registrationCurrentId = 1;
    
    // Initialize with default categories
    this.initializeCategories();
  }

  private initializeCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Music", icon: "music" },
      { name: "Business", icon: "briefcase" },
      { name: "Food & Drink", icon: "utensils" },
      { name: "Arts", icon: "palette" },
      { name: "Sports", icon: "football" },
      { name: "Health", icon: "heart" },
      { name: "Technology", icon: "laptop" },
      { name: "Networking", icon: "users" }
    ];
    
    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category management
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Event management
  async getEvents(filters?: {
    categoryId?: number;
    search?: string;
    startDate?: Date;
    location?: string;
    featured?: boolean;
  }): Promise<Event[]> {
    let filteredEvents = Array.from(this.events.values());
    
    if (filters) {
      if (filters.categoryId) {
        filteredEvents = filteredEvents.filter(
          event => event.categoryId === filters.categoryId
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(
          event => 
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.location.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(
          event => new Date(event.startDate) >= new Date(filters.startDate!)
        );
      }
      
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        filteredEvents = filteredEvents.filter(
          event => event.location.toLowerCase().includes(locationLower)
        );
      }
      
      if (filters.featured !== undefined) {
        filteredEvents = filteredEvents.filter(
          event => event.isFeatured === filters.featured
        );
      }
    }
    
    // Sort by start date
    return filteredEvents.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getEventWithDetails(id: number): Promise<EventWithDetails | undefined> {
    const event = await this.getEvent(id);
    if (!event) return undefined;
    
    const category = await this.getCategory(event.categoryId);
    const organizer = await this.getUser(event.organizerId);
    const ticketTypes = await this.getTicketTypes(id);
    
    if (!category || !organizer) return undefined;
    
    return {
      ...event,
      category,
      organizer,
      ticketTypes
    };
  }
  
  async getEventsByOrganizer(organizerId: number): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => event.organizerId === organizerId)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const createdAt = new Date();
    const event: Event = { ...insertEvent, id, createdAt };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = await this.getEvent(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Ticket management
  async getTicketTypes(eventId: number): Promise<TicketType[]> {
    return Array.from(this.ticketTypes.values())
      .filter(ticketType => ticketType.eventId === eventId);
  }
  
  async getTicketType(id: number): Promise<TicketType | undefined> {
    return this.ticketTypes.get(id);
  }
  
  async createTicketType(insertTicketType: InsertTicketType): Promise<TicketType> {
    const id = this.ticketTypeCurrentId++;
    const ticketType: TicketType = { ...insertTicketType, id };
    this.ticketTypes.set(id, ticketType);
    return ticketType;
  }
  
  async updateTicketType(id: number, ticketTypeData: Partial<InsertTicketType>): Promise<TicketType | undefined> {
    const ticketType = await this.getTicketType(id);
    if (!ticketType) return undefined;
    
    const updatedTicketType = { ...ticketType, ...ticketTypeData };
    this.ticketTypes.set(id, updatedTicketType);
    return updatedTicketType;
  }

  // Registration management
  async getRegistrations(eventId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values())
      .filter(registration => registration.eventId === eventId);
  }
  
  async getRegistrationsByUser(userId: number): Promise<RegistrationWithDetails[]> {
    const userRegistrations = Array.from(this.registrations.values())
      .filter(registration => registration.userId === userId);
    
    const registrationsWithDetails: RegistrationWithDetails[] = [];
    
    for (const registration of userRegistrations) {
      const event = await this.getEvent(registration.eventId);
      const ticketType = await this.getTicketType(registration.ticketTypeId);
      
      if (event && ticketType) {
        registrationsWithDetails.push({
          ...registration,
          event,
          ticketType
        });
      }
    }
    
    return registrationsWithDetails;
  }
  
  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = this.registrationCurrentId++;
    const purchaseDate = new Date();
    const registration: Registration = { ...insertRegistration, id, purchaseDate };
    this.registrations.set(id, registration);
    
    // Update ticket quantity
    const ticketType = await this.getTicketType(insertRegistration.ticketTypeId);
    if (ticketType) {
      await this.updateTicketType(ticketType.id, { 
        quantity: ticketType.quantity - insertRegistration.quantity 
      });
    }
    
    return registration;
  }
  
  async updateRegistrationStatus(id: number, status: string): Promise<Registration | undefined> {
    const registration = this.registrations.get(id);
    if (!registration) return undefined;
    
    const updatedRegistration = { ...registration, status };
    this.registrations.set(id, updatedRegistration);
    return updatedRegistration;
  }
}

export const storage = new MemStorage();
