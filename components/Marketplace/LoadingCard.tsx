
export default function LoadingCard({ 
  height,
  background,
}: { 
  height: string 
  background: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        height: height,
        backgroundImage: background ? 'url(/static/img/interior-dark.png)' : 'none',
      }}
    >
      <img
        src="/static/img/marketplace/loading_card.gif"
        style={{ maxWidth: "200px", transform: "translateY(-100%)", }}
      />
    </div>
  );
}
