/* eslint-disable jsx-a11y/alt-text */
export const InfoInsurgents = () => {
  return (
    <div>
      Each{" "}
      <mark className="glowOrange" id="markInsurgent">
        Insurgent
      </mark>{" "}
      can move vertically on vertices determined by <b>Land</b> hexes. Vertical
      movement is inhibited if the vertex intersects a <b>Transport</b> or{" "}
      <b>Bridge</b> hex. However, it is allowed for <b>Water</b>-adjacent
      vertices if they also interesect the <b>Land</b>. Moving up or down
      vertically counts as one move.
      <div id="insurgentVerticalMovement">
        <div className="insurgentVerticalExample">
          <img
            className="insurgentVerticalImage"
            src={process.env.PUBLIC_URL + "/images/3d/insurgent-3-3d.gif"}
          ></img>
          <p>Below, through tunnels</p>
        </div>
        <div className="insurgentVerticalExample">
          <img
            className="insurgentVerticalImage"
            src={process.env.PUBLIC_URL + "/images/3d/insurgent-1-3d.gif"}
          ></img>
          <p>Ground Level</p>
        </div>
        <div className="insurgentVerticalExample">
          <img
            className="insurgentVerticalImage"
            src={process.env.PUBLIC_URL + "/images/3d/insurgent-2-3d.gif"}
          ></img>
          <p>Above, inside buildings</p>
        </div>
      </div>
    </div>
  );
};
