import type { ComponentType } from "react";
import type { LandingSection, LandingSectionType } from "../types";
import { Cards } from "./Cards";
import { Collections } from "./Collections";
import { Contact } from "./Contact";
import { Cta } from "./Cta";
import { Facts } from "./Facts";
import { Faq } from "./Faq";
import { Features } from "./Features";
import { Gallery } from "./Gallery";
import { Hero } from "./Hero";
import { Logos } from "./Logos";
import { Products } from "./Products";
import { Quotes } from "./Quotes";
import { Story } from "./Story";
import { Text } from "./Text";
import { Video } from "./Video";

export { Empty } from "./Empty";

/** Type → component (closed list). */
export const SECTION_COMPONENTS: Record<LandingSectionType, ComponentType<{ section: LandingSection }>> = {
  hero: Hero,
  text_block: Text,
  story: Story,
  gallery: Gallery,
  video: Video,
  cards: Cards,
  collections: Collections,
  products: Products,
  facts: Facts,
  features: Features,
  quotes: Quotes,
  logos: Logos,
  faq: Faq,
  cta: Cta,
  contact: Contact,
};
