import { MISSING_FIELD } from "../model";
import { Frame, usePage } from "../render";
import type { LandingSection } from "../types";

/** Editor only: a section with nothing to draw shows its name and the missing field. */
export function Empty({ section }: { section: LandingSection }) {
  const { labels } = usePage();
  const field = MISSING_FIELD[section.type];
  return (
    <Frame className="g4mp-section g4mp-empty">
      <div className="g4mp-empty__box">
        <p className="g4mp-empty__type">{labels.sections[section.type]}</p>
        {field && <p className="g4mp-empty__field">{labels.fields[field]}</p>}
      </div>
    </Frame>
  );
}
