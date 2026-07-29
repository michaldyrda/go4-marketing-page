import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarketingPage } from "./MarketingPage";
import { safeHref, safeImgSrc } from "./sanitizeUrl";
import type { MarketingSection } from "./types";

function section(partial: Partial<MarketingSection> & { type: string }): MarketingSection {
  return {
    id: partial.id ?? partial.type,
    type: partial.type,
    is_visible: partial.is_visible ?? true,
    order_index: partial.order_index ?? 0,
    config: partial.config ?? {},
  };
}

describe("MarketingPage", () => {
  it("renders visible sections in order and skips hidden + unknown types", () => {
    const { container } = render(
      <MarketingPage
        sections={[
          section({ type: "text_block", order_index: 2, config: { title: "Second" } }),
          section({ type: "hero", order_index: 1, config: { title: "First" } }),
          section({ type: "team", order_index: 3, is_visible: false, config: { title: "Hidden" } }),
          section({ type: "totally_unknown", order_index: 4, config: { title: "Nope" } }),
        ]}
      />,
    );
    const headings = Array.from(container.querySelectorAll("h1, h2")).map((h) => h.textContent);
    expect(headings).toEqual(["First", "Second"]);
    expect(screen.queryByText("Hidden")).toBeNull();
    expect(screen.queryByText("Nope")).toBeNull();
  });

  it("renders a card per item; a card with a CTA is itself the click target (no button)", () => {
    const onCtaClick = vi.fn();
    render(
      <MarketingPage
        onCtaClick={onCtaClick}
        sections={[
          section({
            type: "cards",
            config: {
              title: "Shop the icons",
              items: [
                { title: "BONEO Hoodie", body: "Heavyweight fleece.", file_url: "https://cdn/x.jpg", cta: { type: "collection", collection_id: "col-9" } },
                { title: "BARELL Pants", body: "Relaxed fit." }, // no CTA → not clickable
              ],
            },
          }),
        ]}
      />,
    );
    expect(screen.getByText("BONEO Hoodie")).toBeInTheDocument();
    expect(screen.getByText("BARELL Pants")).toBeInTheDocument();
    // Only the card with a CTA is a button; the whole tile is the target.
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    expect(onCtaClick).toHaveBeenCalledWith(
      expect.objectContaining({ type: "collection", collection_id: "col-9" }),
    );
  });

  it("passes a collection CTA through onCtaClick untouched (host navigates)", () => {
    const onCtaClick = vi.fn();
    render(
      <MarketingPage
        onCtaClick={onCtaClick}
        sections={[
          section({
            type: "cta",
            config: {
              title: "Explore FW26",
              cta: { label: "See the collection", type: "collection", collection_id: "col-123" },
            },
          }),
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "See the collection" }));
    expect(onCtaClick).toHaveBeenCalledWith(
      expect.objectContaining({ type: "collection", collection_id: "col-123" }),
    );
  });

  it("subtitle wchodzi w każdej sekcji, która ma go w edytorze", () => {
    // Regresja 2026-07-29: team/materials/cards/cta przyjmowały subtitle
    // w panelu i gubiły go przy renderze — klient nigdy go nie widział.
    render(
      <MarketingPage
        sections={[
          section({ type: "story", order_index: 1, config: { subtitle: "Sub story" } }),
          section({ type: "team", order_index: 2, config: { subtitle: "Sub team" } }),
          section({ type: "materials", order_index: 3, config: { subtitle: "Sub materials" } }),
          section({ type: "text_block", order_index: 4, config: { subtitle: "Sub text" } }),
          section({ type: "cta", order_index: 5, config: { subtitle: "Sub cta" } }),
          section({
            type: "cards",
            order_index: 6,
            config: { subtitle: "Sub cards", items: [{ title: "Card" }] },
          }),
        ]}
      />,
    );
    for (const t of ["Sub story", "Sub team", "Sub materials", "Sub text", "Sub cta", "Sub cards"]) {
      expect(screen.getByText(t)).toBeTruthy();
    }
  });

  it("empty cards section renders nothing", () => {
    const { container } = render(
      <MarketingPage sections={[section({ type: "cards", config: { title: "x", items: [] } })]} />,
    );
    expect(container.querySelector(".g4mp-cards")).toBeNull();
  });

  it("forceMobile marks the root and swaps the image to the mobile crop", () => {
    const { container } = render(
      <MarketingPage
        forceMobile
        sections={[
          section({
            type: "hero",
            config: {
              title: "Hero",
              media: [{ role: "hero_image", media_type: "image", file_url: "https://cdn/desk.jpg", mobile_file_url: "https://cdn/mob.jpg" }],
            },
          }),
        ]}
      />,
    );
    expect(container.querySelector(".g4mp--mobile")).not.toBeNull();
    const img = container.querySelector(".g4mp-hero__img") as HTMLImageElement;
    expect(img.src).toContain("mob.jpg");
    // Forced mobile renders a bare <img>, not a <picture> with a desktop source.
    expect(container.querySelector("picture")).toBeNull();
  });

  it("without forceMobile uses <picture> with a mobile <source>", () => {
    const { container } = render(
      <MarketingPage
        sections={[
          section({
            type: "hero",
            config: { title: "Hero", media: [{ role: "hero_image", media_type: "image", file_url: "https://cdn/desk.jpg", mobile_file_url: "https://cdn/mob.jpg" }] },
          }),
        ]}
      />,
    );
    expect(container.querySelector("picture source")?.getAttribute("srcset")).toContain("mob.jpg");
  });

  it("applies transformImageUrl to image sources", () => {
    const { container } = render(
      <MarketingPage
        transformImageUrl={(url, w) => `${url}?w=${w}`}
        sections={[
          section({ type: "story", config: { title: "S", media: [{ media_type: "image", file_url: "https://cdn/s.jpg" }] } }),
        ]}
      />,
    );
    const img = container.querySelector(".g4mp-story__img") as HTMLImageElement;
    expect(img.src).toContain("?w=600");
  });

  it("drops a dangerous javascript: image URL instead of rendering it", () => {
    const { container } = render(
      <MarketingPage
        sections={[
          section({ type: "story", config: { title: "S", media: [{ media_type: "image", file_url: "javascript:alert(1)" }] } }),
        ]}
      />,
    );
    expect(container.querySelector(".g4mp-story__img")).toBeNull();
  });
});

describe("url guards", () => {
  it("safeHref allows http(s) and same-origin paths only", () => {
    expect(safeHref("https://go4.fashion")).toBe("https://go4.fashion");
    expect(safeHref("/orders")).toBe("/orders");
    expect(safeHref("javascript:alert(1)")).toBeUndefined();
    expect(safeHref("//evil.com")).toBeUndefined();
    expect(safeHref("data:text/html,x")).toBeUndefined();
    expect(safeHref(null)).toBeUndefined();
  });

  it("safeImgSrc additionally allows data:image but not data:text", () => {
    expect(safeImgSrc("data:image/png;base64,AAAA")).toContain("data:image");
    expect(safeImgSrc("data:text/html,x")).toBeUndefined();
    expect(safeImgSrc("javascript:alert(1)")).toBeUndefined();
  });
});
