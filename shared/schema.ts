import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Category table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
});

// Event table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  organizerId: integer("organizer_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ticket type table
export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Store in cents
  quantity: integer("quantity").notNull(),
  description: text("description"),
});

// Registration table
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  userId: integer("user_id").notNull().references(() => users.id),
  ticketTypeId: integer("ticket_type_id").notNull().references(() => ticketTypes.id),
  quantity: integer("quantity").notNull(),
  totalPrice: integer("total_price").notNull(), // Store in cents
  status: text("status").notNull().default("confirmed"),
  purchaseDate: timestamp("purchase_date").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertTicketTypeSchema = createInsertSchema(ticketTypes).omit({ id: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true, purchaseDate: true });

// Extended schemas with validation
export const userSignupSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const eventCreationSchema = insertEventSchema.extend({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const ticketPurchaseSchema = insertRegistrationSchema.extend({
  quantity: z.number().min(1),
}).refine((data) => data.quantity > 0, {
  message: "Quantity must be at least 1",
  path: ["quantity"],
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserSignup = z.infer<typeof userSignupSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventCreation = z.infer<typeof eventCreationSchema>;

export type TicketType = typeof ticketTypes.$inferSelect;
export type InsertTicketType = z.infer<typeof insertTicketTypeSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type TicketPurchase = z.infer<typeof ticketPurchaseSchema>;

// Event with related information for frontend display
export type EventWithDetails = Event & {
  category: Category;
  organizer: User;
  ticketTypes: TicketType[];
};

// Registration with related information for tickets display
export type RegistrationWithDetails = Registration & {
  event: Event;
  ticketType: TicketType;
};
