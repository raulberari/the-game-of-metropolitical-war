/* eslint-disable jsx-a11y/alt-text */
export const InfoWinning = () => {
  return (
    <div>
      The{" "}
      <mark className="glowWhite" id="markHegemon">
        Hegemon
      </mark>{" "}
      <i>breaks the back</i> of the local insurrection by killing at least{" "}
      <b>20</b> Insurgents.
      <br />
      <br />
      The{" "}
      <mark className="glowOrange" id="markInsurgent">
        Insurgents
      </mark>{" "}
      <i>topple the regime</i> by eliminating <b>all</b> Hegemon forces.
      <img
        className="textImage"
        src={process.env.PUBLIC_URL + "/images/visuals/sarajevo-1.jpg"}
      ></img>
      <img
        className="textImage"
        src={process.env.PUBLIC_URL + "/images/visuals/russia-1.jpg"}
      ></img>
    </div>
  );
};
