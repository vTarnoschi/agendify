import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock Clerk Profile
  http.get("/api/user/profile", () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: "mock-provider-123",
        clerkId: "user_123",
        email: "provider@test.com",
        name: "Mock Provider",
        role: "provider",
      },
    });
  }),

  // Mock Availability
  http.get("/api/availability", () => {
    return HttpResponse.json({
      success: true,
      data: {
        slots: ["09:00", "11:00"],
      },
    });
  }),

  // Mock Appointment Creation
  http.post("/api/appointments", () => {
    return HttpResponse.json(
      {
        success: true,
        data: { id: "appointment-123", status: "confirmed" },
      },
      { status: 201 },
    );
  }),
];
