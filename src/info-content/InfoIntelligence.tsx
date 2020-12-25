/* eslint-disable jsx-a11y/alt-text */
export const InfoIntelligence = (props: { city: string }) => {
  const { city } = props;
  switch (city) {
    case "NEW YORK CITY":
      return (
        <div>
          NYC has swelled to over 50,000 people per km<sup>2</sup>, an
          over-crowded megacity of 40 million. It's been 18 months since the NY
          Energy Dpt. switched its production to petrol by redeploying oil
          pumps, following a highly coordinated{" "}
          <mark className="glowOrange" id="markInsurgent">
            Insurgent
          </mark>{" "}
          attack that has destroyed a large part of their dams. The inland sea
          spanning the South-Western part of the state has flooded the adjacent
          municipalities, pushing refugees every day into the crowded complexes.
          <img
            className="textImage"
            src={process.env.PUBLIC_URL + "/images/visuals/oil-drills-2.jpg"}
          ></img>
          In 2032, the metropolitan area zoning commitee banned the existence of
          buildings smaller than 150ft, citing density concerns. By 2037, all
          individual households have been razed and replaced with hyper-dense
          towers, pierced by high-speed rail viaducts.
          <img
            className="textImage"
            src={process.env.PUBLIC_URL + "/images/visuals/chongqing-3.jpg"}
          ></img>
          The{" "}
          <mark className="glowWhite" id="markHegemon">
            Hegemon
          </mark>{" "}
          manages a slow but powerful city-state power on a continuous mission
          of pacifying the 'feral' city that grew out of hand. It has already
          re-established its control over the municipal waters, after the highly
          destructive offshore rig terrorist attack proved its weakness.
          <img
            className="textImage"
            src={process.env.PUBLIC_URL + "/images/visuals/offshore-2.png"}
          ></img>
        </div>
      );
    default:
      return <div></div>;
  }
};
