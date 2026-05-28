import { describe, it, expect } from "vitest";
import {
  getAvailability,
  createPublicAppointment,
  convertGuestAccount,
} from "./booking-service";
import { server } from "../tests/msw/server";
import { http, HttpResponse } from "msw";

describe("Booking Service", () => {
  it("getAvailability should return slots", async () => {
    // Using default MSW handler returning ['09:00', '11:00']
    const slots = await getAvailability({
      slug: "test",
      date: "2026-05-22",
      serviceId: "1",
    });
    expect(slots).toEqual(["09:00", "11:00"]);
  });

  it("createPublicAppointment should return success boolean", async () => {
    server.use(
      http.post("/api/appointments", () => {
        return HttpResponse.json({ success: true, data: null });
      }),
    );
    const success = await createPublicAppointment({
      slug: "test",
      date: "2026-05-22",
      title: "Test",
      description: "",
    });
    expect(success).toBe(true);
  });

  it("convertGuestAccount should return success boolean", async () => {
    server.use(
      http.post("/api/appointments/convert-guest", () => {
        return HttpResponse.json({ success: true, data: null });
      }),
    );
    const success = await convertGuestAccount({
      email: "test@example.com",
    });
    expect(success).toBe(true);
  });
});
