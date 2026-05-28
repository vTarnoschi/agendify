import { faker } from "@faker-js/faker";

export const createMockUser = (overrides?: Record<string, unknown>) => {
  return {
    id: faker.string.uuid(),
    clerkId: `user_${faker.string.alphanumeric(10)}`,
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: "client",
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
};

export const createMockProvider = (overrides?: Record<string, unknown>) => {
  return createMockUser({
    role: "provider",
    services: [],
    appointments: [],
    ...overrides,
  });
};
