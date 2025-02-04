import { calculatePriority } from "../src/utils/taskUtils.js";

describe("calculatePriority function", () => {
    test("Returns 'high' if isCritical is true", () => {
        expect(calculatePriority(true, "2025-02-10")).toBe("high");
    });

    test("Returns 'high' if due date is within 3 days", () => {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 2);
        expect(calculatePriority(false, dueDate.toISOString())).toBe("high");
    });

    test("Returns 'medium' if due date is within 4 to 7 days", () => {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 5);
        expect(calculatePriority(false, dueDate.toISOString())).toBe("medium");
    });

    test("Returns 'low' if due date is more than 7 days away", () => {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 10);
        expect(calculatePriority(false, dueDate.toISOString())).toBe("low");
    });

    test("Handles past due dates correctly", () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        expect(calculatePriority(false, pastDate.toISOString())).toBe("high");
    });
});
