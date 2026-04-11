import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CampaignCard from "@/features/campaigns/components/CampaignCard.jsx";

const mockCampaign = {
  title: "Test Campaign",
  coverImage: { secure_url: "https://example.com/image.png" },
  raisedAmount: 1000,
  totalPlannedCost: 5000,
  location: { locationName: "Colombo" },
  status: "ONGOING",
};

describe("CampaignCard", () => {
  it("renders campaign title, location, and formatted amounts", () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        deleting={false}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Test Campaign")).toBeDefined();
    expect(screen.getByText("Colombo")).toBeDefined();
    expect(screen.getByText(/LKR/)).toBeDefined();
  });

  it("calls callback handlers when buttons are clicked", async () => {
    const viewHandler = vi.fn();
    const editHandler = vi.fn();
    const deleteHandler = vi.fn();
    const user = userEvent.setup();

    render(
      <CampaignCard
        campaign={mockCampaign}
        deleting={false}
        onView={viewHandler}
        onEdit={editHandler}
        onDelete={deleteHandler}
      />,
    );

    await user.click(screen.getByRole("button", { name: /View/i }));
    await user.click(screen.getByRole("button", { name: /Update/i }));
    await user.click(screen.getByRole("button", { name: /Delete campaign/i }));

    expect(viewHandler).toHaveBeenCalledTimes(1);
    expect(editHandler).toHaveBeenCalledTimes(1);
    expect(deleteHandler).toHaveBeenCalledTimes(1);
  });

  it("disables delete button when deleting prop is true", () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        deleting={true}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /Delete campaign/i });
    expect(deleteButton.disabled).toBe(true);
  });
});
