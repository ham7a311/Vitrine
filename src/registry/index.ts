import type { Category, ComponentMeta } from "./types";
import { meta as glassbreakButton } from "./buttons/glassbreak-button/meta";
import { meta as cascadeButton } from "./buttons/cascade-button/meta";
import { meta as tickerRingButton } from "./buttons/ticker-ring-button/meta";
import { meta as liquidGlassButton } from "./buttons/liquid-glass-button/meta";
import { meta as spotlightGroup } from "./buttons/spotlight-group/meta";
import { meta as tidefillButton } from "./buttons/tidefill-button/meta";
import { meta as phosphorGlassButton } from "./buttons/phosphor-glass-button/meta";
import { meta as irisShutterButton } from "./buttons/iris-shutter-button/meta";
import { meta as dissolveButton } from "./buttons/dissolve-button/meta";
import { meta as neonTubeButton } from "./buttons/neon-tube-button/meta";
import { meta as machinedBevelButton } from "./buttons/machined-bevel-button/meta";
import { meta as hingeSplitButton } from "./buttons/hinge-split-button/meta";
import { meta as ringFloodButton } from "./buttons/ring-flood-button/meta";
import { meta as glassSlabButton } from "./buttons/glass-slab-button/meta";
import { meta as perimeterHoldButton } from "./buttons/perimeter-hold-button/meta";
import { meta as pluckedStringButton } from "./buttons/plucked-string-button/meta";
import { meta as chromaticButton } from "./buttons/chromatic-button/meta";
import { meta as keycap } from "./buttons/keycap/meta";
import { meta as swellButton } from "./buttons/swell-button/meta";
import { meta as sloshButton } from "./buttons/slosh-button/meta";
import { meta as letterpressButton } from "./buttons/letterpress-button/meta";
import { meta as sketchButton } from "./buttons/sketch-button/meta";
import { meta as foldawayButton } from "./buttons/foldaway-button/meta";
import { meta as stratumButton } from "./buttons/stratum-button/meta";
import { meta as entryRingButton } from "./buttons/entry-ring-button/meta";
import { meta as rippleRimButton } from "./buttons/ripple-rim-button/meta";
import { meta as cooldownButton } from "./buttons/cooldown-button/meta";
import { meta as relayButton } from "./buttons/relay-button/meta";
import { meta as tallyButton } from "./buttons/tally-button/meta";
import { meta as ditherButton } from "./buttons/dither-button/meta";
import { meta as marqueeLightsButton } from "./buttons/marquee-lights-button/meta";
import { meta as puddleButton } from "./buttons/puddle-button/meta";
import { meta as gradientBloomButton } from "./buttons/gradient-bloom-button/meta";
import { meta as dropletButton } from "./buttons/droplet-button/meta";
import { meta as magneticButton } from "./buttons/magnetic-button/meta";
import { meta as doubleRuleButton } from "./buttons/double-rule-button/meta";
import { meta as stitchButton } from "./buttons/stitch-button/meta";
import { meta as emberButton } from "./buttons/ember-button/meta";
import { meta as followToggle } from "./buttons/follow-toggle/meta";
import { meta as pullCord } from "./buttons/pull-cord/meta";
import { meta as commandPill } from "./buttons/command-pill/meta";
import { meta as glassLensSwitch } from "./buttons/glass-lens-switch/meta";
import { meta as drawLink } from "./buttons/draw-link/meta";
import { meta as entryPointButton } from "./buttons/entry-point-button/meta";
import { meta as stackButton } from "./buttons/stack-button/meta";
import { meta as offsetPressButton } from "./buttons/offset-press-button/meta";
import { meta as gamutPicker } from "./controls/gamut-picker/meta";
import { meta as fractionCheckbox } from "./controls/fraction-checkbox/meta";
import { meta as moodSlider } from "./controls/mood-slider/meta";
import { meta as gelToggle } from "./controls/gel-toggle/meta";
import { meta as mercurySegments } from "./controls/mercury-segments/meta";
import { meta as histogramRange } from "./controls/histogram-range/meta";
import { meta as rulerPicker } from "./controls/ruler-picker/meta";
import { meta as detentKnob } from "./controls/detent-knob/meta";
import { meta as eclipseToggle } from "./controls/eclipse-toggle/meta";
import { meta as rockerSwitch } from "./controls/rocker-switch/meta";
import { meta as snoozeRail } from "./controls/snooze-rail/meta";
import { meta as themeDial } from "./controls/theme-dial/meta";
import { meta as punchCheck } from "./controls/punch-check/meta";
import { meta as pulseLoader } from "./controls/pulse-loader/meta";
import { meta as leverSwitch } from "./controls/lever-switch/meta";
import { meta as inkTick } from "./controls/ink-tick/meta";
import { meta as bracketCheckbox } from "./controls/bracket-checkbox/meta";
import { meta as timeWindow } from "./controls/time-window/meta";
import { meta as presetKeys } from "./controls/preset-keys/meta";
import { meta as gateSelector } from "./controls/gate-selector/meta";
import { meta as shadowBoard } from "./controls/shadow-board/meta";
import { meta as notificationDial } from "./controls/notification-dial/meta";
import { meta as patchBay } from "./controls/patch-bay/meta";
import { meta as glassCard } from "./cards/glass-card/meta";
import { meta as haloFrame } from "./cards/halo-frame/meta";
import { meta as ringFloodCard } from "./cards/ring-flood-card/meta";
import { meta as tidefillCard } from "./cards/tidefill-card/meta";
import { meta as liquidGlassCard } from "./cards/liquid-glass-card/meta";
import { meta as holoFoilCard } from "./cards/holo-foil-card/meta";
import { meta as depthCard } from "./cards/depth-card/meta";
import { meta as vinylSleeveCard } from "./cards/vinyl-sleeve-card/meta";
import { meta as instantPhotoCard } from "./cards/instant-photo-card/meta";
import { meta as lenticularCard } from "./cards/lenticular-card/meta";
import { meta as ticketCard } from "./cards/ticket-card/meta";
import { meta as blueprintCard } from "./cards/blueprint-card/meta";
import { meta as rippleRimCard } from "./cards/ripple-rim-card/meta";
import { meta as meanderTimeline } from "./cards/meander-timeline/meta";
import { meta as orbitCard } from "./cards/orbit-card/meta";
import { meta as folioCard } from "./cards/folio-card/meta";
import { meta as atmosphereCard } from "./cards/atmosphere-card/meta";
import { meta as receiptCard } from "./cards/receipt-card/meta";
import { meta as highlighterRow } from "./cards/highlighter-row/meta";
import { meta as nextUp } from "./cards/next-up/meta";
import { meta as featureTrio } from "./cards/feature-trio/meta";
import { meta as entryPointCard } from "./cards/entry-point-card/meta";
import { meta as swatchCard } from "./cards/swatch-card/meta";
import { meta as fanDeckCard } from "./cards/fan-deck-card/meta";
import { meta as versionStack } from "./cards/version-stack/meta";
import { meta as approachCard } from "./cards/approach-card/meta";
import { meta as ditherCard } from "./cards/dither-card/meta";
import { meta as postcardCard } from "./cards/postcard-card/meta";
import { meta as eclipseEventCard } from "./cards/eclipse-event-card/meta";
import { meta as specimenCard } from "./cards/specimen-card/meta";
import { meta as cardWallet } from "./cards/card-wallet/meta";
import { meta as patina } from "./cards/patina/meta";
import { meta as silkField } from "./backgrounds/silk-field/meta";
import { meta as glassTiles } from "./backgrounds/glass-tiles/meta";
import { meta as ditherFlow } from "./backgrounds/dither-flow/meta";
import { meta as glassOrbs } from "./backgrounds/glass-orbs/meta";
import { meta as liquidChrome } from "./backgrounds/liquid-chrome/meta";
import { meta as lightCurtain } from "./backgrounds/light-curtain/meta";
import { meta as glassBlinds } from "./backgrounds/glass-blinds/meta";
import { meta as starTrails } from "./backgrounds/star-trails/meta";
import { meta as gravityGrid } from "./backgrounds/gravity-grid/meta";
import { meta as tessera } from "./backgrounds/tessera/meta";
import { meta as glassRibbons } from "./backgrounds/glass-ribbons/meta";
import { meta as isobar } from "./backgrounds/isobar/meta";
import { meta as prismLight } from "./backgrounds/prism-light/meta";
import { meta as fiberOptics } from "./backgrounds/fiber-optics/meta";
import { meta as cyanotype } from "./backgrounds/cyanotype/meta";
import { meta as fireflySync } from "./backgrounds/firefly-sync/meta";
import { meta as ribbonFlow } from "./backgrounds/ribbon-flow/meta";
import { meta as flutedGlass } from "./backgrounds/fluted-glass/meta";
import { meta as slattedLight } from "./backgrounds/slatted-light/meta";
import { meta as loom } from "./backgrounds/loom/meta";
import { meta as dotSwarm } from "./backgrounds/dot-swarm/meta";
import { meta as spotlightGrid } from "./backgrounds/spotlight-grid/meta";
import { meta as moireVeil } from "./backgrounds/moire-veil/meta";
import { meta as lightLeak } from "./backgrounds/light-leak/meta";
import { meta as waveMesh } from "./backgrounds/wave-mesh/meta";
import { meta as duneField } from "./backgrounds/dune-field/meta";
import { meta as waxLamp } from "./backgrounds/wax-lamp/meta";
import { meta as condensation } from "./backgrounds/condensation/meta";
import { meta as apertureRings } from "./backgrounds/aperture-rings/meta";
import { meta as marbledInk } from "./backgrounds/marbled-ink/meta";
import { meta as windMap } from "./backgrounds/wind-map/meta";
import { meta as bayerHorizon } from "./backgrounds/bayer-horizon/meta";
import { meta as duskMesh } from "./backgrounds/dusk-mesh/meta";
import { meta as tidalLines } from "./backgrounds/tidal-lines/meta";
import { meta as mercuryGlass } from "./backgrounds/mercury-glass/meta";
import { meta as bokehCity } from "./backgrounds/bokeh-city/meta";
import { meta as glyphSwell } from "./backgrounds/glyph-swell/meta";
import { meta as causticPool } from "./backgrounds/caustic-pool/meta";
import { meta as rippleTank } from "./backgrounds/ripple-tank/meta";
import { meta as glowPointer } from "./cursors/glow-pointer/meta";
import { meta as highlightSweep } from "./cursors/highlight-sweep/meta";
import { meta as eyeTracker } from "./cursors/eye-tracker/meta";
import { meta as nibTrail } from "./cursors/nib-trail/meta";
import { meta as haloPointer } from "./cursors/halo-pointer/meta";
import { meta as plainPointer } from "./cursors/plain-pointer/meta";
import { meta as caliper } from "./cursors/caliper/meta";
import { meta as intentLabel } from "./cursors/intent-label/meta";
import { meta as tether } from "./cursors/tether/meta";
import { meta as presenceCursors } from "./cursors/presence-cursors/meta";
import { meta as loupe } from "./cursors/loupe/meta";
import { meta as highlightCursor } from "./cursors/highlight-cursor/meta";
import { meta as snapFrame } from "./cursors/snap-frame/meta";
import { meta as streamReply } from "./ai/stream-reply/meta";
import { meta as voiceOrb } from "./ai/voice-orb/meta";
import { meta as agentRun } from "./ai/agent-run/meta";
import { meta as diffusionPreview } from "./ai/diffusion-preview/meta";
import { meta as promptComposer } from "./ai/prompt-composer/meta";
import { meta as attachmentTray } from "./ai/attachment-tray/meta";
import { meta as toolCall } from "./ai/tool-call/meta";
import { meta as branchSwitcher } from "./ai/branch-switcher/meta";
import { meta as promptStarters } from "./ai/prompt-starters/meta";
import { meta as modelPicker } from "./ai/model-picker/meta";
import { meta as auraField } from "./ai/aura-field/meta";
import { meta as contextMeter } from "./ai/context-meter/meta";
import { meta as voiceCapsule } from "./ai/voice-capsule/meta";
import { meta as thinkingTrace } from "./ai/thinking-trace/meta";
import { meta as messageActions } from "./ai/message-actions/meta";
import { meta as inlineDiff } from "./ai/inline-diff/meta";
import { meta as citedAnswer } from "./ai/cited-answer/meta";
import { meta as splice } from "./ai/splice/meta";
import { meta as confidenceInk } from "./ai/confidence-ink/meta";
import { meta as conversationSidebar } from "./sidebars/conversation-sidebar/meta";
import { meta as workspaceSidebar } from "./sidebars/workspace-sidebar/meta";
import { meta as glassTorus } from "./heroes/glass-torus/meta";
import { meta as localSkyHero } from "./heroes/local-sky-hero/meta";
import { meta as letterformHero } from "./heroes/letterform-hero/meta";
import { meta as waitlistHero } from "./heroes/waitlist-hero/meta";
import { meta as mastheadNav } from "./navbars/masthead-nav/meta";
import { meta as glassTabBar } from "./navigation/glass-tab-bar/meta";
import { meta as slideTabs } from "./navigation/slide-tabs/meta";
import { meta as thumbedEdge } from "./navigation/thumbed-edge/meta";
import { meta as rulerIndex } from "./navigation/ruler-index/meta";
import { meta as pleatCrumbs } from "./navigation/pleat-crumbs/meta";
import { meta as threadStepper } from "./navigation/thread-stepper/meta";
import { meta as lessonPath } from "./navigation/lesson-path/meta";
import { meta as lineMap } from "./navigation/line-map/meta";
import { meta as depthDialog } from "./overlays/depth-dialog/meta";
import { meta as contextLens } from "./overlays/context-lens/meta";
import { meta as foldSheet } from "./overlays/fold-sheet/meta";
import { meta as searchLens } from "./data/search-lens/meta";
import { meta as mediaInspector } from "./data/media-inspector/meta";
import { meta as focusTable } from "./data/focus-table/meta";
import { meta as marginalia } from "./data/marginalia/meta";
import { meta as activityStream } from "./data/activity-stream/meta";
import { meta as blockHandles } from "./data/block-handles/meta";
import { meta as boardView } from "./data/board-view/meta";
import { meta as leagueTable } from "./data/league-table/meta";
import { meta as queryCell } from "./data/query-cell/meta";
import { meta as installSnippet } from "./data/install-snippet/meta";
import { meta as columnProfile } from "./data/column-profile/meta";
import { meta as transactionLedger } from "./data/transaction-ledger/meta";
import { meta as approvalInbox } from "./data/approval-inbox/meta";
import { meta as sieve } from "./data/sieve/meta";
import { meta as pairwiseRanker } from "./decisions/pairwise-ranker/meta";
import { meta as magnetBoard } from "./decisions/magnet-board/meta";
import { meta as allocationFaders } from "./decisions/allocation-faders/meta";
import { meta as undoTree } from "./time/undo-tree/meta";
import { meta as conflictResolver } from "./time/conflict-resolver/meta";
import { meta as cronBuilder } from "./time/cron-builder/meta";
import { meta as timezoneOverlap } from "./time/timezone-overlap/meta";
import { meta as queryTokens } from "./developer/query-tokens/meta";
import { meta as keymap } from "./developer/keymap/meta";
import { meta as logTail } from "./developer/log-tail/meta";
import { meta as spanWaterfall } from "./developer/span-waterfall/meta";
import { meta as curtainFooter } from "./footers/curtain-footer/meta";
import { meta as signOffFooter } from "./footers/sign-off-footer/meta";
import { meta as indexFooter } from "./footers/index-footer/meta";
import { meta as subtractivePricing } from "./pricing/subtractive-pricing/meta";
import { meta as usageRuler } from "./pricing/usage-ruler/meta";
import { meta as lightboxCompare } from "./pricing/lightbox-compare/meta";
import { meta as calendarPricing } from "./pricing/calendar-pricing/meta";
import { meta as stackPricing } from "./pricing/stack-pricing/meta";
import { meta as chalkMenuPricing } from "./pricing/chalk-menu-pricing/meta";
import { meta as buildSheet } from "./commerce/build-sheet/meta";
import { meta as fitCompare } from "./commerce/fit-compare/meta";
import { meta as explodedView } from "./commerce/exploded-view/meta";
import { meta as indexFaq } from "./faq/index-faq/meta";
import { meta as footnoteFaq } from "./faq/footnote-faq/meta";
import { meta as helpDeskFaq } from "./faq/help-desk-faq/meta";
import { meta as searchFaq } from "./faq/search-faq/meta";
import { meta as focusFaq } from "./faq/focus-faq/meta";
import { meta as chatThreadFaq } from "./faq/chat-thread-faq/meta";
import { meta as origamiFaq } from "./faq/origami-faq/meta";
import { meta as cardCatalogueFaq } from "./faq/card-catalogue-faq/meta";
import { meta as colourRegisterFaq } from "./faq/colour-register-faq/meta";
import { meta as reactiveProse } from "./reading/reactive-prose/meta";
import { meta as stretchtext } from "./reading/stretchtext/meta";
import { meta as tidelineCta } from "./ctas/tideline-cta/meta";
import { meta as liquidGlassCta } from "./ctas/liquid-glass-cta/meta";
import { meta as focusPullCta } from "./ctas/focus-pull-cta/meta";
import { meta as halftoneCta } from "./ctas/halftone-cta/meta";
import { meta as tickerRingCta } from "./ctas/ticker-ring-cta/meta";
import { meta as ringFloodCta } from "./ctas/ring-flood-cta/meta";
import { meta as cascadePitchCta } from "./ctas/cascade-pitch-cta/meta";
import { meta as entryPointCta } from "./ctas/entry-point-cta/meta";
import { meta as inlineCta } from "./ctas/inline-cta/meta";
import { meta as arrivalCta } from "./ctas/arrival-cta/meta";
import { meta as nocturneSignIn } from "./auth/nocturne-sign-in/meta";
import { meta as qrHandoffSignIn } from "./auth/qr-handoff-sign-in/meta";
import { meta as consentSignIn } from "./auth/consent-sign-in/meta";
import { meta as passkeySignIn } from "./auth/passkey-sign-in/meta";
import { meta as codeCascadeVerify } from "./auth/code-cascade-verify/meta";
import { meta as envelopeReset } from "./auth/envelope-reset/meta";
import { meta as accountChooser } from "./auth/account-chooser/meta";
import { meta as inviteJoin } from "./auth/invite-join/meta";
import { meta as oneFieldSignIn } from "./auth/one-field-sign-in/meta";
import { meta as numberMatchSignIn } from "./auth/number-match-sign-in/meta";
import { meta as sigilSignIn } from "./auth/sigil-sign-in/meta";
import { meta as liquidGlassSignIn } from "./auth/liquid-glass-sign-in/meta";
import { meta as boardingPassSignIn } from "./auth/boarding-pass-sign-in/meta";
import { meta as strengthRingSignUp } from "./auth/strength-ring-sign-up/meta";
import { meta as workspaceSignIn } from "./auth/workspace-sign-in/meta";
import { meta as ledgerCylinder } from "./stats/ledger-cylinder/meta";
import { meta as odometerStats } from "./stats/odometer-stats/meta";
import { meta as orbitRingStats } from "./stats/orbit-ring-stats/meta";
import { meta as metricMorph } from "./stats/metric-morph/meta";
import { meta as tideGaugeStats } from "./stats/tide-gauge-stats/meta";
import { meta as flowFunnelStats } from "./stats/flow-funnel-stats/meta";
import { meta as isotypeStats } from "./stats/isotype-stats/meta";
import { meta as uptimeRibbon } from "./stats/uptime-ribbon/meta";
import { meta as percentileCurveStats } from "./stats/percentile-curve-stats/meta";
import { meta as hourDialStats } from "./stats/hour-dial-stats/meta";
import { meta as scrubSparklineStats } from "./stats/scrub-sparkline-stats/meta";
import { meta as streakFieldStats } from "./stats/streak-field-stats/meta";
import { meta as balanceStats } from "./stats/balance-stats/meta";
import { meta as splitBarStats } from "./stats/split-bar-stats/meta";
import { meta as thenNowStats } from "./stats/then-now-stats/meta";
import { meta as lessonSummary } from "./stats/lesson-summary/meta";
import { meta as dailyQuests } from "./stats/daily-quests/meta";
import { meta as modelBench } from "./analytics/model-bench/meta";
import { meta as sankeyFlow } from "./analytics/sankey-flow/meta";
import { meta as pulseLineChart } from "./analytics/pulse-line-chart/meta";
import { meta as bubbleTimeline } from "./analytics/bubble-timeline/meta";
import { meta as streamGraph } from "./analytics/stream-graph/meta";
import { meta as cohortRetention } from "./analytics/cohort-retention/meta";
import { meta as brushZoomChart } from "./analytics/brush-zoom-chart/meta";
import { meta as waterfallBridge } from "./analytics/waterfall-bridge/meta";
import { meta as sunburstDrill } from "./analytics/sunburst-drill/meta";
import { meta as calendarHeatmap } from "./analytics/calendar-heatmap/meta";
import { meta as barRace } from "./analytics/bar-race/meta";
import { meta as slopeChart } from "./analytics/slope-chart/meta";
import { meta as youDrawIt } from "./analytics/you-draw-it/meta";
import { meta as glassCarousel } from "./media/glass-carousel/meta";
import { meta as artGallery } from "./media/art-gallery/meta";
import { meta as imageCompare } from "./media/image-compare/meta";
import { meta as hoverReel } from "./media/hover-reel/meta";
import { meta as ditherPortrait } from "./media/dither-portrait/meta";
import { meta as contactSheet } from "./media/contact-sheet/meta";
import { meta as routeGlobe } from "./maps/route-globe/meta";
import { meta as pulseGlobe } from "./maps/pulse-globe/meta";
import { meta as dotAtlas } from "./maps/dot-atlas/meta";
import { meta as signaturePad } from "./forms/signature-pad/meta";
import { meta as ribbonOtp } from "./forms/ribbon-otp/meta";
import { meta as glassLid } from "./forms/glass-lid/meta";
import { meta as uploadStack } from "./forms/upload-stack/meta";
import { meta as progressiveForm } from "./forms/progressive-form/meta";
import { meta as sentenceSettings } from "./forms/sentence-settings/meta";
import { meta as etchedField } from "./forms/etched-field/meta";
import { meta as insertMenu } from "./forms/insert-menu/meta";
import { meta as wordBank } from "./forms/word-bank/meta";
import { meta as schemaDrop } from "./forms/schema-drop/meta";
import { meta as spendControls } from "./forms/spend-controls/meta";
import { meta as transferComposer } from "./forms/transfer-composer/meta";
import { meta as scrubNumber } from "./forms/scrub-number/meta";
import { meta as segmentCounter } from "./forms/segment-counter/meta";
import { meta as toastStack } from "./feedback/toast-stack/meta";
import { meta as wetInk } from "./feedback/wet-ink/meta";
import { meta as undoRibbon } from "./feedback/undo-ribbon/meta";
import { meta as firstLight } from "./feedback/first-light/meta";
import { meta as progressiveReveal } from "./feedback/progressive-reveal/meta";
import { meta as missingGlyph404 } from "./feedback/missing-glyph-404/meta";
import { meta as unlitGallery404 } from "./feedback/unlit-gallery-404/meta";
import { meta as wayfinder404 } from "./feedback/wayfinder-404/meta";
import { meta as errata404 } from "./feedback/errata-404/meta";
import { meta as quietReturn404 } from "./feedback/quiet-return-404/meta";
import { meta as trace404 } from "./feedback/trace-404/meta";
import { meta as forwarding404 } from "./feedback/forwarding-404/meta";
import { meta as underside404 } from "./feedback/underside-404/meta";
import { meta as blankPageStarter } from "./feedback/blank-page-starter/meta";
import { meta as stepPath } from "./sections/step-path/meta";
import { meta as voicesCarousel } from "./sections/voices-carousel/meta";
import { meta as partnerRibbon } from "./sections/partner-ribbon/meta";
import { meta as productAtelier } from "./sections/product-atelier/meta";
import { meta as pageHeader } from "./sections/page-header/meta";
import { meta as quickstartChecklist } from "./sections/quickstart-checklist/meta";
import { meta as ditherLogo } from "./type/dither-logo/meta";
import { meta as constellationName } from "./type/constellation-name/meta";
import { meta as sealSignature } from "./type/seal-signature/meta";
import { meta as feralTitle } from "./type/feral-title/meta";
import { meta as chapterNumeral } from "./type/chapter-numeral/meta";
import { meta as rollCall } from "./type/roll-call/meta";
import { meta as flourishName } from "./type/flourish-name/meta";
import { meta as initialFold } from "./type/initial-fold/meta";
import { meta as loupeRoster } from "./type/loupe-roster/meta";
import { meta as endCredits } from "./type/end-credits/meta";
import { meta as heartBurst } from "./micro/heart-burst/meta";
import { meta as paperPlane } from "./micro/paper-plane/meta";
import { meta as bellRing } from "./micro/bell-ring/meta";
import { meta as copyCheck } from "./micro/copy-check/meta";
import { meta as downloadTray } from "./micro/download-tray/meta";
import { meta as starRate } from "./micro/star-rate/meta";
import { meta as trashDrop } from "./micro/trash-drop/meta";
import { meta as bookmarkFold } from "./micro/bookmark-fold/meta";
import { meta as chromeText } from "./text/chrome-text/meta";
import { meta as splitFlapText } from "./text/split-flap-text/meta";
import { meta as extrudeText } from "./text/extrude-text/meta";
import { meta as scrollInkText } from "./text/scroll-ink-text/meta";
import { meta as weightWaveText } from "./text/weight-wave-text/meta";
import { meta as looseLetters } from "./text/loose-letters/meta";
import { meta as wordCarousel } from "./text/word-carousel/meta";
import { meta as secondDraftText } from "./text/second-draft-text/meta";

/** Curated order — registry sequence from order.txt. Category views use this order; All round-robins it. */
export const registry: ComponentMeta[] = [
  glassbreakButton,
  cascadeButton,
  tickerRingButton,
  liquidGlassButton,
  spotlightGroup,
  tidefillButton,
  phosphorGlassButton,
  irisShutterButton,
  dissolveButton,
  neonTubeButton,
  machinedBevelButton,
  hingeSplitButton,
  ringFloodButton,
  glassSlabButton,
  perimeterHoldButton,
  pluckedStringButton,
  chromaticButton,
  keycap,
  swellButton,
  sloshButton,
  letterpressButton,
  sketchButton,
  foldawayButton,
  stratumButton,
  entryRingButton,
  rippleRimButton,
  cooldownButton,
  relayButton,
  tallyButton,
  ditherButton,
  marqueeLightsButton,
  puddleButton,
  gradientBloomButton,
  dropletButton,
  magneticButton,
  doubleRuleButton,
  stitchButton,
  emberButton,
  followToggle,
  pullCord,
  commandPill,
  glassLensSwitch,
  drawLink,
  entryPointButton,
  stackButton,
  offsetPressButton,
  gamutPicker,
  fractionCheckbox,
  moodSlider,
  gelToggle,
  mercurySegments,
  histogramRange,
  rulerPicker,
  detentKnob,
  eclipseToggle,
  rockerSwitch,
  snoozeRail,
  themeDial,
  punchCheck,
  pulseLoader,
  leverSwitch,
  inkTick,
  bracketCheckbox,
  timeWindow,
  presetKeys,
  gateSelector,
  shadowBoard,
  notificationDial,
  patchBay,
  glassCard,
  haloFrame,
  ringFloodCard,
  tidefillCard,
  liquidGlassCard,
  holoFoilCard,
  depthCard,
  vinylSleeveCard,
  instantPhotoCard,
  lenticularCard,
  ticketCard,
  blueprintCard,
  rippleRimCard,
  meanderTimeline,
  orbitCard,
  folioCard,
  atmosphereCard,
  receiptCard,
  highlighterRow,
  nextUp,
  featureTrio,
  entryPointCard,
  swatchCard,
  fanDeckCard,
  versionStack,
  approachCard,
  ditherCard,
  postcardCard,
  eclipseEventCard,
  specimenCard,
  cardWallet,
  patina,
  silkField,
  glassTiles,
  ditherFlow,
  glassOrbs,
  liquidChrome,
  lightCurtain,
  glassBlinds,
  starTrails,
  gravityGrid,
  tessera,
  glassRibbons,
  isobar,
  prismLight,
  fiberOptics,
  cyanotype,
  fireflySync,
  ribbonFlow,
  flutedGlass,
  slattedLight,
  loom,
  dotSwarm,
  spotlightGrid,
  moireVeil,
  lightLeak,
  waveMesh,
  duneField,
  waxLamp,
  condensation,
  apertureRings,
  marbledInk,
  windMap,
  bayerHorizon,
  duskMesh,
  tidalLines,
  mercuryGlass,
  bokehCity,
  glyphSwell,
  causticPool,
  rippleTank,
  glowPointer,
  highlightSweep,
  eyeTracker,
  nibTrail,
  haloPointer,
  plainPointer,
  caliper,
  intentLabel,
  tether,
  presenceCursors,
  loupe,
  highlightCursor,
  snapFrame,
  streamReply,
  voiceOrb,
  agentRun,
  diffusionPreview,
  promptComposer,
  attachmentTray,
  toolCall,
  branchSwitcher,
  promptStarters,
  modelPicker,
  auraField,
  contextMeter,
  voiceCapsule,
  thinkingTrace,
  messageActions,
  inlineDiff,
  citedAnswer,
  splice,
  confidenceInk,
  conversationSidebar,
  workspaceSidebar,
  glassTorus,
  localSkyHero,
  letterformHero,
  waitlistHero,
  mastheadNav,
  glassTabBar,
  slideTabs,
  thumbedEdge,
  rulerIndex,
  pleatCrumbs,
  threadStepper,
  lessonPath,
  lineMap,
  depthDialog,
  contextLens,
  foldSheet,
  searchLens,
  mediaInspector,
  focusTable,
  marginalia,
  activityStream,
  blockHandles,
  boardView,
  leagueTable,
  queryCell,
  installSnippet,
  columnProfile,
  transactionLedger,
  approvalInbox,
  sieve,
  pairwiseRanker,
  magnetBoard,
  allocationFaders,
  undoTree,
  conflictResolver,
  cronBuilder,
  timezoneOverlap,
  queryTokens,
  keymap,
  logTail,
  spanWaterfall,
  curtainFooter,
  signOffFooter,
  indexFooter,
  subtractivePricing,
  usageRuler,
  lightboxCompare,
  calendarPricing,
  stackPricing,
  chalkMenuPricing,
  buildSheet,
  fitCompare,
  explodedView,
  indexFaq,
  footnoteFaq,
  helpDeskFaq,
  searchFaq,
  focusFaq,
  chatThreadFaq,
  origamiFaq,
  cardCatalogueFaq,
  colourRegisterFaq,
  reactiveProse,
  stretchtext,
  tidelineCta,
  liquidGlassCta,
  focusPullCta,
  halftoneCta,
  tickerRingCta,
  ringFloodCta,
  cascadePitchCta,
  entryPointCta,
  inlineCta,
  arrivalCta,
  nocturneSignIn,
  qrHandoffSignIn,
  consentSignIn,
  passkeySignIn,
  codeCascadeVerify,
  envelopeReset,
  accountChooser,
  inviteJoin,
  oneFieldSignIn,
  numberMatchSignIn,
  sigilSignIn,
  liquidGlassSignIn,
  boardingPassSignIn,
  strengthRingSignUp,
  workspaceSignIn,
  ledgerCylinder,
  odometerStats,
  orbitRingStats,
  metricMorph,
  tideGaugeStats,
  flowFunnelStats,
  isotypeStats,
  uptimeRibbon,
  percentileCurveStats,
  hourDialStats,
  scrubSparklineStats,
  streakFieldStats,
  balanceStats,
  splitBarStats,
  thenNowStats,
  lessonSummary,
  dailyQuests,
  modelBench,
  sankeyFlow,
  pulseLineChart,
  bubbleTimeline,
  streamGraph,
  cohortRetention,
  brushZoomChart,
  waterfallBridge,
  sunburstDrill,
  calendarHeatmap,
  barRace,
  slopeChart,
  youDrawIt,
  glassCarousel,
  artGallery,
  imageCompare,
  hoverReel,
  ditherPortrait,
  contactSheet,
  routeGlobe,
  pulseGlobe,
  dotAtlas,
  signaturePad,
  ribbonOtp,
  glassLid,
  uploadStack,
  progressiveForm,
  sentenceSettings,
  etchedField,
  insertMenu,
  wordBank,
  schemaDrop,
  spendControls,
  transferComposer,
  scrubNumber,
  segmentCounter,
  toastStack,
  wetInk,
  undoRibbon,
  firstLight,
  progressiveReveal,
  missingGlyph404,
  unlitGallery404,
  wayfinder404,
  errata404,
  quietReturn404,
  trace404,
  forwarding404,
  underside404,
  blankPageStarter,
  stepPath,
  voicesCarousel,
  partnerRibbon,
  productAtelier,
  pageHeader,
  quickstartChecklist,
  ditherLogo,
  constellationName,
  sealSignature,
  feralTitle,
  chapterNumeral,
  rollCall,
  flourishName,
  initialFold,
  loupeRoster,
  endCredits,
  heartBurst,
  paperPlane,
  bellRing,
  copyCheck,
  downloadTray,
  starRate,
  trashDrop,
  bookmarkFold,
  chromeText,
  splitFlapText,
  extrudeText,
  scrollInkText,
  weightWaveText,
  looseLetters,
  wordCarousel,
  secondDraftText,
];

export function getComponent(slug: string) {
  return registry.find((c) => c.slug === slug);
}

export function byCategory(category: Category) {
  return registry.filter((c) => c.category === category);
}

/** Lightweight shape for client components (search, gallery). */
export type ComponentSummary = Pick<
  ComponentMeta,
  "slug" | "name" | "category" | "description" | "tags" | "traits" | "preview" | "isNew" | "featured"
> & { index: number };

export function summaries(): ComponentSummary[] {
  return registry.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    category: c.category,
    description: c.description,
    tags: c.tags,
    traits: c.traits,
    preview: c.preview,
    isNew: c.isNew,
    featured: c.featured,
    index: i + 1,
  }));
}
