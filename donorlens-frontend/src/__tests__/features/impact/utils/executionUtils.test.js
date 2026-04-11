import { describe, it, expect, vi } from "vitest";
import {
  formatCurrency,
  formatDate,
  calculateProgress,
  calculateExecutionProgress,
} from "../../../../features/impact/utils/executionUtils";

describe("ExecutionUtils Performance Tests", () => {
  const mockExecutions = Array.from({ length: 100 }, (_, i) => ({
    _id: `exec-${i}`,
    title: `Execution ${i}`,
    date: new Date(2026, 0, i + 1).toISOString(),
    fundsUsed: Math.random() * 10000,
    description: `Test execution ${i}`,
    evidencePhotos: [],
    receipts: [],
  }));

  describe("formatCurrency Performance", () => {
    it("should format currency efficiently for 1000 operations", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        formatCurrency(Math.random() * 100000);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`formatCurrency: ${duration.toFixed(2)}ms for 1000 calls`);
      expect(duration).toBeLessThan(500); // Should complete in < 500ms
    });
  });

  describe("formatDate Performance", () => {
    it("should format dates efficiently for 1000 operations", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        formatDate(new Date().toISOString());
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`formatDate: ${duration.toFixed(2)}ms for 1000 calls`);
      expect(duration).toBeLessThan(500);
    });
  });

  describe("calculateProgress Performance", () => {
    it("should calculate progress efficiently for 1000 operations", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        calculateProgress(Math.random() * 50000, 100000);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`calculateProgress: ${duration.toFixed(2)}ms for 1000 calls`);
      expect(duration).toBeLessThan(300);
    });
  });

  describe("calculateExecutionProgress Performance", () => {
    it("should process 100 executions efficiently", () => {
      const startTime = performance.now();

      const result = calculateExecutionProgress(mockExecutions, 100000);

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(
        `calculateExecutionProgress: ${duration.toFixed(2)}ms for 100 executions`,
      );

      expect(result).toHaveLength(100);
      expect(duration).toBeLessThan(100); // Should complete in < 100ms
    });

    it("should calculate cumulative percentages correctly for 100 executions", () => {
      const result = calculateExecutionProgress(mockExecutions, 100000);

      // Last execution should have highest percentage
      const lastExecution = result[0]; // Most recent first
      const percentages = result.map((e) => e.progressPercentage);

      expect(lastExecution.progressPercentage).toBeLessThanOrEqual(100);
      expect(Math.max(...percentages)).toBeLessThanOrEqual(100);
    });
  });

  describe("Memory Usage", () => {
    it("should not leak memory when processing large datasets", () => {
      const iterations = 5;
      const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;

      for (let i = 0; i < iterations; i++) {
        calculateExecutionProgress(mockExecutions, 100000);
      }

      const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const memoryIncrease = finalMemory - initialMemory;

      console.log(
        `Memory increase: ${memoryIncrease.toFixed(2)}MB after ${iterations} iterations`,
      );

      // Memory increase should be minimal (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50);
    });
  });
});
