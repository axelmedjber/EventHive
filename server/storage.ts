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
    
    // Initialize with some default categories and sample data
    this.seedCategories();
    this.seedSampleData();
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
  
  // Seed sample data
  private async seedSampleData() {
    try {
      // Skip if we already have events
      if (this.events.size > 0) {
        return;
      }
      
      console.log("Seeding sample data...");
      const bcrypt = require('bcryptjs');
      
      // Create organizer users
      const users = [
        {
          username: "musicpromoter",
          password: "password123",
          email: "music@eventhub.com",
          name: "Music Promoter",
          bio: "Professional music event organizer with 10+ years of experience",
          profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
          isOrganizer: true
        },
        {
          username: "techconference",
          password: "password123",
          email: "tech@eventhub.com",
          name: "Tech Conference",
          bio: "Organizing the best tech conferences in the industry",
          profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
          isOrganizer: true
        },
        {
          username: "foodfestival",
          password: "password123",
          email: "food@eventhub.com",
          name: "Food Festival Organizer",
          bio: "Creating delicious food events since 2010",
          profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
          isOrganizer: true
        },
        {
          username: "sportsevents",
          password: "password123",
          email: "sports@eventhub.com",
          name: "Sports Event Planner",
          bio: "Making sporting events accessible to everyone",
          profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
          isOrganizer: true
        },
        {
          username: "artexhibition",
          password: "password123",
          email: "art@eventhub.com",
          name: "Art Exhibition Curator",
          bio: "Highlighting emerging and established artists",
          profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
          isOrganizer: true
        }
      ];
    
      const createdUsers: { [key: string]: number } = {};
    
      for (const userData of users) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const insertUser: InsertUser = {
          ...userData,
          password: hashedPassword
        };
        
        const user = await this.createUser(insertUser);
        createdUsers[userData.username] = user.id;
      }
    
      // Create attendee users
      const attendees = [
        {
          username: "eventgoer1",
          password: "password123",
          email: "attendee1@example.com",
          name: "John Doe",
          bio: "Love attending events of all kinds",
          profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
          isOrganizer: false
        },
        {
          username: "eventgoer2",
          password: "password123",
          email: "attendee2@example.com",
          name: "Jane Smith",
          bio: "Always looking for the next great experience",
          profileImage: "https://randomuser.me/api/portraits/women/12.jpg",
          isOrganizer: false
        }
      ];
    
      for (const userData of attendees) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const insertUser: InsertUser = {
          ...userData,
          password: hashedPassword
        };
        
        const user = await this.createUser(insertUser);
        createdUsers[userData.username] = user.id;
      }
    
      // Get all categories
      const categories = await this.getAllCategories();
      
      // Create events
      const events = [
        {
          title: "Summer Music Festival 2023",
          description: "Join us for the biggest summer music festival featuring top artists from around the world. Enjoy three days of amazing performances across multiple stages.",
          image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          startDate: new Date(2023, 7, 15, 14, 0), // August 15, 2023, 2:00 PM
          endDate: new Date(2023, 7, 17, 23, 0),   // August 17, 2023, 11:00 PM
          location: "Central Park",
          address: "Central Park, New York, NY",
          isVirtual: false,
          virtualMeetingLink: "",
          organizerId: createdUsers["musicpromoter"],
          categoryId: categories.find(c => c.slug === "music")?.id || 1,
          isFeatured: true,
          status: "active"
        },
        {
          title: "Tech Innovation Summit",
          description: "Discover the latest trends in technology and innovation at our annual Tech Summit. Network with industry leaders and attend workshops on AI, blockchain, and more.",
          image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          startDate: new Date(2023, 5, 10, 9, 0),  // June 10, 2023, 9:00 AM
          endDate: new Date(2023, 5, 11, 17, 0),   // June 11, 2023, 5:00 PM
          location: "San Francisco Convention Center",
          address: "747 Howard St, San Francisco, CA 94103",
          isVirtual: false,
          virtualMeetingLink: "",
          organizerId: createdUsers["techconference"],
          categoryId: categories.find(c => c.slug === "technology")?.id || 3,
          isFeatured: true,
          status: "active"
        },
        {
          title: "Global Food Festival",
          description: "Experience cuisine from around the world at our Global Food Festival. Taste dishes from renowned chefs and discover new flavors in this gastronomic adventure.",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          startDate: new Date(2023, 9, 5, 11, 0),  // October 5, 2023, 11:00 AM
          endDate: new Date(2023, 9, 7, 22, 0),    // October 7, 2023, 10:00 PM
          location: "Chicago Riverfront",
          address: "Chicago Riverwalk, Chicago, IL",
          isVirtual: false,
          virtualMeetingLink: "",
          organizerId: createdUsers["foodfestival"],
          categoryId: categories.find(c => c.slug === "food-drink")?.id || 2,
          isFeatured: true,
          status: "active"
        },
        {
          title: "International Art Exhibition",
          description: "Explore contemporary art from emerging and established artists at our International Art Exhibition. Features paintings, sculptures, digital art, and interactive installations.",
          image: "https://images.unsplash.com/photo-1520155346-36773ab29479?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          startDate: new Date(2023, 4, 20, 10, 0), // May 20, 2023, 10:00 AM
          endDate: new Date(2023, 5, 15, 18, 0),   // June 15, 2023, 6:00 PM
          location: "Modern Art Museum",
          address: "151 3rd St, San Francisco, CA 94103",
          isVirtual: false,
          virtualMeetingLink: "",
          organizerId: createdUsers["artexhibition"],
          categoryId: categories.find(c => c.slug === "arts")?.id || 4,
          isFeatured: false,
          status: "active"
        },
        {
          title: "Urban Marathon 2023",
          description: "Run through the streets of Los Angeles in this annual urban marathon. Suitable for runners of all levels with 5K, 10K, half-marathon, and full marathon courses.",
          image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          startDate: new Date(2023, 3, 8, 7, 0),   // April 8, 2023, 7:00 AM
          endDate: new Date(2023, 3, 8, 15, 0),    // April 8, 2023, 3:00 PM
          location: "Downtown Los Angeles",
          address: "Los Angeles City Hall, Los Angeles, CA",
          isVirtual: false,
          virtualMeetingLink: "",
          organizerId: createdUsers["sportsevents"],
          categoryId: categories.find(c => c.slug === "sports")?.id || 5,
          isFeatured: false,
          status: "active"
        },
        {
          title: "Virtual Business Leadership Conference",
          description: "Enhance your leadership skills with our online business conference. Learn from industry experts and participate in interactive sessions from anywhere in the world.",
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          startDate: new Date(2023, 6, 25, 8, 0),  // July 25, 2023, 8:00 AM
          endDate: new Date(2023, 6, 26, 17, 0),   // July 26, 2023, 5:00 PM
          location: "Online Event",
          address: "",
          isVirtual: true,
          virtualMeetingLink: "https://meeting.example.com/business-conference",
          organizerId: createdUsers["techconference"],
          categoryId: categories.find(c => c.slug === "business")?.id || 6,
          isFeatured: false,
          status: "active"
        }
      ];
    
      const createdEvents: Event[] = [];
    
      for (const eventData of events) {
        const insertEvent: InsertEvent = eventData;
        const event = await this.createEvent(insertEvent);
        createdEvents.push(event);
      }
    
      // Create tickets for each event
      for (const event of createdEvents) {
        // Create standard ticket
        const standardTicket: InsertTicket = {
          name: "Standard Admission",
          price: event.title.includes("Virtual") ? 29.99 : 49.99,
          quantity: 100,
          description: "Regular admission ticket",
          eventId: event.id,
          available: 100
        };
        await this.createTicket(standardTicket);
    
        // Create VIP ticket
        const vipTicket: InsertTicket = {
          name: "VIP Experience",
          price: event.title.includes("Virtual") ? 79.99 : 149.99,
          quantity: 30,
          description: "VIP ticket with premium access and special perks",
          eventId: event.id,
          available: 30
        };
        await this.createTicket(vipTicket);
    
        if (!event.isVirtual) {
          // Create early bird ticket
          const earlyBirdTicket: InsertTicket = {
            name: "Early Bird Special",
            price: 39.99,
            quantity: 50,
            description: "Limited early bird tickets at a reduced price",
            eventId: event.id,
            available: 50
          };
          await this.createTicket(earlyBirdTicket);
        }
      }
    
      // Create some registrations
      // Attendee 1 registers for the music festival
      const musicEvent = createdEvents.find(e => e.title === "Summer Music Festival 2023");
      if (musicEvent) {
        const tickets = await this.getTicketsByEvent(musicEvent.id);
        const standardTicket = tickets.find(t => t.name === "Standard Admission");
        
        if (standardTicket) {
          await this.createRegistration({
            userId: createdUsers["eventgoer1"],
            eventId: musicEvent.id,
            ticketId: standardTicket.id,
            quantity: 2,
            totalAmount: standardTicket.price * 2,
            status: "confirmed"
          });
        }
      }
    
      // Attendee 2 registers for the tech conference
      const techEvent = createdEvents.find(e => e.title === "Tech Innovation Summit");
      if (techEvent) {
        const tickets = await this.getTicketsByEvent(techEvent.id);
        const vipTicket = tickets.find(t => t.name === "VIP Experience");
        
        if (vipTicket) {
          await this.createRegistration({
            userId: createdUsers["eventgoer2"],
            eventId: techEvent.id,
            ticketId: vipTicket.id,
            quantity: 1,
            totalAmount: vipTicket.price,
            status: "confirmed"
          });
        }
      }
    
      console.log("Sample data seeding completed!");
    } catch (error) {
      console.error("Error seeding sample data:", error);
    }
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
