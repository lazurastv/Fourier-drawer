import { HammerGestureConfig } from "@angular/platform-browser";

export class MCrewHammerConfig extends HammerGestureConfig {
    public override overrides = {
        "pan": { direction: 30 },
        "press": { time: 300 }
    };
}