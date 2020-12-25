/* eslint-disable jsx-a11y/alt-text */
export const InfoInsurgents = () => {
  return (
    <div>
      <p>
        The power of the{" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgents
        </mark>{" "}
        lies in their numbers. They move quickly, executing terrorist attacks
        inside{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>
        -controlled areas. Swarm-like coordination strengthens their escape
        capabilities.
      </p>
      <h2>Movement</h2>
      <p>
        {" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgents
        </mark>{" "}
        can perform up to three steps each round by moving both horizontally and
        vertically. Clicking one reveals its range.{" "}
      </p>
      <p>
        Each{" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgent
        </mark>{" "}
        can move vertically on vertices determined by <b>Land</b> hexes.
        Vertical movement is inhibited if the vertex intersects a{" "}
        <b>Transport</b> or <b>Bridge</b> hex. However, it is allowed for{" "}
        <b>Water</b>-adjacent vertices if they also interesect the <b>Land</b>.
        Moving up or down vertically counts as one move.
      </p>
      <div id="insurgentVerticalMovement">
        <div className="insurgentVerticalExample">
          <img
            className="insurgentVerticalImage"
            src={process.env.PUBLIC_URL + "/images/3d/insurgent-3-3d.gif"}
          ></img>
          <p>
            <b>Below</b>, through tunnels
          </p>
        </div>
        <div className="insurgentVerticalExample">
          <img
            className="insurgentVerticalImage"
            src={process.env.PUBLIC_URL + "/images/3d/insurgent-1-3d.gif"}
          ></img>
          <p>
            <b>Ground</b> level
          </p>
        </div>
        <div className="insurgentVerticalExample">
          <img
            className="insurgentVerticalImage"
            src={process.env.PUBLIC_URL + "/images/3d/insurgent-2-3d.gif"}
          ></img>
          <p>
            <b>Above</b>, inside buildings
          </p>
        </div>
      </div>
      <p>
        Moving vertically encourages the usage of civilian house snipers,
        underground explosives or remote-controlled drones, offering the{" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgents
        </mark>{" "}
        a tactical advantage over the slowness of the{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon.
        </mark>
      </p>

      <h2>Dying</h2>
      <p>
        At the <b>Ground</b> level, an{" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgent
        </mark>{" "}
        hit by a single{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>{" "}
        attack will die. However, an{" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgent
        </mark>{" "}
        residing <b>Above</b> or <b>Below</b> can only be killed by two attacks
        performed in the same round.
      </p>
      <div id="generalMovement">
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src={process.env.PUBLIC_URL + "/images/hegemon-attack.gif"}
          ></img>
          Single Attack
        </div>
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src={process.env.PUBLIC_URL + "/images/hegemon-attack-2.gif"}
          ></img>
          Multiple Attacks
        </div>
      </div>
    </div>
  );
};
