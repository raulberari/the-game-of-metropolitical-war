/* eslint-disable jsx-a11y/alt-text */
export const InfoGameplay = () => {
  return (
    <div>
      The Game of Metropolitical War emulates hybrid and asymmetric warfare in a
      densely populated built-up city. Packed vertical slums and Plan Voisin
      corporate centers. 5G lights-out factories and chip production households.
      <p>
        Agile swarms of{" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgents
        </mark>{" "}
        are railed against the highly-centralized, elephantine{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>{" "}
      </p>
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
        <img
          className="hexImage"
          src={process.env.PUBLIC_URL + "/images/hex-water.png"}
        ></img>
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
        <img
          className="hexImage"
          src={process.env.PUBLIC_URL + "/images/hex-transport.png"}
        ></img>
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
        <img
          className="hexImage"
          src={process.env.PUBLIC_URL + "/images/hex-bridge.png"}
        ></img>
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
      <h2>Movement</h2>
      The{" "}
      <mark className="glowOrange" id="markInsurgent">
        Insurgents
      </mark>{" "}
      play "Go" by moving horizontally and vertically onto the vertices, while
      the{" "}
      <mark className="glowWhite" id="markHegemon">
        Hegemon
      </mark>{" "}
      plays "Chess" by moving on the hexes.
      <div id="generalMovement">
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src={process.env.PUBLIC_URL + "/images/insurgent-move.gif"}
          ></img>
          Insurgent Movement
        </div>
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src={process.env.PUBLIC_URL + "/images/hegemon-move.gif"}
          ></img>
          Hegemon Movement
        </div>
      </div>
      <h2>Attacking</h2>
      <p>
        {" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgents
        </mark>{" "}
        attack the{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>{" "}
        passively at the end of their round, killing those that have been
        encircled by a "wall". Multiple adjacent Hegemon units affect this
        behavior, see Hegemon{">"}Dying.
      </p>
      <p>
        Instead of moving, a{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>{" "}
        unit can attack the adjacent hexes to execute the{" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgents.
        </mark>{" "}
        Vertical movement affects this, see Insurgents{">"}
        Dying.
      </p>
      <div id="generalMovement">
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src={process.env.PUBLIC_URL + "/images/insurgent-attack.gif"}
          ></img>
          Insurgent Attack
        </div>
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src={process.env.PUBLIC_URL + "/images/hegemon-attack.gif"}
          ></img>
          Hegemon Attack
        </div>
      </div>
      <h2>Game Timeline</h2>
      <h3>Pre-Game</h3>
      <div className="gameTimelineStepInsurgent">
        <p>
          The Insurgents start by placing 4 pieces on the board. Each must be in
          a 3-vertex range from any other one.
        </p>
      </div>
      <div className="gameTimelineStepHegemon">
        <p>
          The Hegemon follows up by placing 6 units on the board, with the
          restriction that they cannot include any Insurgent in their attack
          range.
        </p>
      </div>
      <h3>Insurgent Round</h3>
      <div className="gameTimelineStepInsurgent">
        <p>
          The Insurgents are moved until they run out of steps or the "End
          Round" button is pressed.
        </p>
        <p>
          At the end of the round, a new Insurgent is placed on the board, using
          the same 3-vertex range rule as the initial placement.
        </p>
        <p>If any Hegemon unit or group of units is encircled, it will die.</p>
      </div>
      <h3>Hegemon Round</h3>
      <div className="gameTimelineStepHegemon">
        <p>
          The Hegemon units move or attack until they run out of steps or the
          "End Round" button is pressed.
        </p>
      </div>
    </div>
  );
};
