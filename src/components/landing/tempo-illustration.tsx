/** Static vectors generated from the app's locked brand source. No raster upscaling or animation layer. */
export function TempoIllustration({ state = "headsUp", size = 100, className }: { state?: "headsUp" | "thinking" | "niceOne"; size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`tempo-illustration ${className ?? ""}`} src={`/assets/tempo-${state}.svg`} width={size * 136 / 74} height={size} alt="" decoding="async" />
  );
}
