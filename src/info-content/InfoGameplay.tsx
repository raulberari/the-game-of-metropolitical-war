/* eslint-disable jsx-a11y/alt-text */
export const InfoGameplay = () => {
  return (
    <div>
      The Game of Metropolitical War emulates hybrid and asymmetric warfare in a
      densely populated built-up city of packed vertical slums, Plan Voisin
      corporate centers, 5G lights-out factories and chip production households.
      It places the agile swarms of{" "}
      <mark className="glowOrange" id="markInsurgent">
        Insurgents
      </mark>{" "}
      against the highly-centralized, elephantine{" "}
      <mark className="glowWhite" id="markHegemon">
        Hegemon
      </mark>{" "}
      <br />
      <h2>Hex Types</h2>The map is composed of four different types of hexes:
      <br />
      <div className="hexDescription">
        <img
          className="hexImage"
          src={process.env.PUBLIC_URL + "/images/hex-land.png"}
        ></img>
        <p>
          <b>Land</b> hex, accessible to the{" "}
          <mark className="glowOrange" id="markInsurgent">
            Insurgents
          </mark>{" "}
          and the{" "}
          <mark className="glowWhite" id="markHegemon">
            Hegemon.
          </mark>{" "}
          It represents the built environment: tower blocks, underground tunnel
          networks, skywalks and alleyways. It offers the possibility of
          vertical movement for the{" "}
          <mark className="glowOrange" id="markInsurgent">
            Insurgents.
          </mark>
        </p>
      </div>
      <div className="hexDescription">
        <img className="hexImage" src="images/hex-water.png"></img>
        <p>
          <b>Water</b> hex, spanning rivers, artifcial seas, gulfs, accumulation
          lakes and canals. Accessible only to the{" "}
          <mark className="glowWhite" id="markHegemon">
            Hegemon
          </mark>{" "}
          thanks to its naval superiority.
        </p>
      </div>
      <div className="hexDescription">
        <img className="hexImage" src="images/hex-transport.png"></img>
        <p>
          <b>Transport</b> hex, representing bustling boulevards, highways,
          subway lines and viaducts. Due to the high civilian numbers, it is
          only accessible to the{" "}
          <mark className="glowOrange" id="markInsurgent">
            Insurgents
          </mark>{" "}
          and vertical movement is inhibited.
        </p>
      </div>
      <div className="hexDescription">
        <img className="hexImage" src="images/hex-bridge.png"></img>
        <p>
          <b>Bridge</b> hex, which is a combined <b>Water</b> and{" "}
          <b>Transport</b> space. Accesible to both the{" "}
          <mark className="glowOrange" id="markInsurgent">
            Insurgents
          </mark>{" "}
          and the{" "}
          <mark className="glowWhite" id="markHegemon">
            Hegemon.
          </mark>{" "}
        </p>
      </div>
      <h2>Movement & Attack</h2>
      The{" "}
      <mark className="glowOrange" id="markInsurgent">
        Insurgents
      </mark>{" "}
      play "Go" by moving onto the vertices, while the{" "}
      <mark className="glowWhite" id="markHegemon">
        Hegemon
      </mark>{" "}
      plays "Chess" by moving on the hexes. Insurgents have three moves, which
      can be spent by either going
      <div id="generalMovement">
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src="images/insurgent-movement.png"
          ></img>
          Insurgent Movement
        </div>
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src="/images/hegemon-movement.png"
          ></img>
          Hegemon Movement
        </div>
      </div>
      <h2>Starting Up</h2>
      The{" "}
      <mark className="glowOrange" id="markInsurgent">
        Insurgents
      </mark>{" "}
      start by placing 4 pieces on the board. Each piece must be in a 3-vertex
      range from any other one.
    </div>
  );
};
