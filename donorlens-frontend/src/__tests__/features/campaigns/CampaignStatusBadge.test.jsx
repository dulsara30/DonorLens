import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CampaignStatusBadge from "@/features/campaigns/components/CampaignStatusBadge.jsx";

describe("CampaignStatusBadge", () => {
  it("renders Ongoing badge for ONGOING status", () => {
    render(<CampaignStatusBadge status="ONGOING" />);
    const badge = screen.getByText("Ongoing");
    expect(badge).toBeDefined();
  });

  it("renders Completed badge for COMPLETED status", () => {
    render(<CampaignStatusBadge status="COMPLETED" />);
    const badge = screen.getByText("Completed");
    expect(badge).toBeDefined();
  });

  it("renders nothing for unsupported status", () => {
    const { container } = render(<CampaignStatusBadge status="CANCELLED" />);
    expect(container.innerHTML).toBe("");
  });
});
