import { storage } from "../server/storage";
import bcrypt from "bcryptjs";
import { Event, InsertEvent, InsertTicket, InsertUser } from "@shared/schema";

async function seedData() {
  console.log("Seeding data...");

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
    
    const user = await storage.createUser(insertUser);
    createdUsers[userData.username] = user.id;
    console.log(`Created user: ${user.name} (ID: ${user.id})`);
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
    
    const user = await storage.createUser(insertUser);
    createdUsers[userData.username] = user.id;
    console.log(`Created attendee: ${user.name} (ID: ${user.id})`);
  }

  // Get all categories
  const categories = await storage.getAllCategories();
  
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
    const event = await storage.createEvent(insertEvent);
    createdEvents.push(event);
    console.log(`Created event: ${event.title} (ID: ${event.id})`);
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
    await storage.createTicket(standardTicket);

    // Create VIP ticket
    const vipTicket: InsertTicket = {
      name: "VIP Experience",
      price: event.title.includes("Virtual") ? 79.99 : 149.99,
      quantity: 30,
      description: "VIP ticket with premium access and special perks",
      eventId: event.id,
      available: 30
    };
    await storage.createTicket(vipTicket);

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
      await storage.createTicket(earlyBirdTicket);
    }

    console.log(`Created tickets for event: ${event.title}`);
  }

  // Create some registrations
  // Attendee 1 registers for the music festival
  const musicEvent = createdEvents.find(e => e.title === "Summer Music Festival 2023");
  if (musicEvent) {
    const tickets = await storage.getTicketsByEvent(musicEvent.id);
    const standardTicket = tickets.find(t => t.name === "Standard Admission");
    
    if (standardTicket) {
      await storage.createRegistration({
        userId: createdUsers["eventgoer1"],
        eventId: musicEvent.id,
        ticketId: standardTicket.id,
        quantity: 2,
        totalAmount: standardTicket.price * 2,
        status: "confirmed"
      });
      console.log(`Created registration for eventgoer1 to ${musicEvent.title}`);
    }
  }

  // Attendee 2 registers for the tech conference
  const techEvent = createdEvents.find(e => e.title === "Tech Innovation Summit");
  if (techEvent) {
    const tickets = await storage.getTicketsByEvent(techEvent.id);
    const vipTicket = tickets.find(t => t.name === "VIP Experience");
    
    if (vipTicket) {
      await storage.createRegistration({
        userId: createdUsers["eventgoer2"],
        eventId: techEvent.id,
        ticketId: vipTicket.id,
        quantity: 1,
        totalAmount: vipTicket.price,
        status: "confirmed"
      });
      console.log(`Created registration for eventgoer2 to ${techEvent.title}`);
    }
  }

  console.log("Data seeding completed!");
}

// Run the seed function
seedData()
  .then(() => console.log("Seeding successful!"))
  .catch(error => console.error("Error seeding data:", error));