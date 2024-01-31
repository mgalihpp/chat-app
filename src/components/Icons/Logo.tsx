export default function Logo({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return <img src={"/logo.jpg"} alt="logo" width={width} height={height} />;
}
