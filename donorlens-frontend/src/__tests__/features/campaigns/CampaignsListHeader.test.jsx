import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CampaignsListHeader from "@/features/campaigns/components/CampaignsListHeader.jsx";

describe("CampaignsListHeader", () => {
  it("renders campaign count and New Campaign button label", () => {
    render(<CampaignsListHeader count={5} onCreateNew={vi.fn()} />);

    expect(screen.getByText("5 campaign(s)")).toBeDefined();
    expect(screen.getByRole("button", { name: /New Campaign/i })).toBeDefined();
  });

  it("calls onCreateNew when the button is clicked", async () => {
    const onCreateNew = vi.fn();
    const user = userEvent.setup();

    render(<CampaignsListHeader count={3} onCreateNew={onCreateNew} />);

    await user.click(screen.getByRole("button", { name: /New Campaign/i }));

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });
});
