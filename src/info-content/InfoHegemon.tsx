/* eslint-disable jsx-a11y/alt-text */
export const InfoHegemon = () => {
  return (
    <div id="infoHegemon">
      <p>
        The{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>{" "}
        is built up around ISR values (Intelligence, Surveillance and
        Reconnaissance)
      </p>
      <div id="generalMovement">
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src={process.env.PUBLIC_URL + "/images/3d/hegemon-3d-2.gif"}
          ></img>
        </div>
      </div>
      <h2>Movement</h2>
      <p>
        Each{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>{" "}
        has one step per round, which can be spent by either moving or
        attacking. Clicking a unit reveals its movement range. Right clicking
        shows the attack range.
      </p>
      <div id="generalMovement">
        <div className="generalMovementExample">
          <img
            className="generalMovementImage"
            src={process.env.PUBLIC_URL + "/images/hegemon-mov-att.gif"}
          ></img>
          <p>Attack and Movement Preview</p>
        </div>
      </div>

      <h2>Dying</h2>
      <p>
        {" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>{" "}
        units die if they get encircled by{" "}
        <mark className="glowOrange" id="markInsurgent">
          Insurgents,
        </mark>{" "}
        regardless of the latter's vertical level. Multiple{" "}
        <mark className="glowWhite" id="markHegemon">
          Hegemon
        </mark>{" "}
        pieces can group up, thus extending the necessary area needed for their
        encirclement.
        <div id="generalMovement">
          <div className="generalMovementExample">
            <img
              className="generalMovementImage"
              src={process.env.PUBLIC_URL + "/images/insurgent-attack.gif"}
            ></img>
            Encircling One Unit
          </div>
          <div className="generalMovementExample">
            <img
              className="generalMovementImage"
              src={process.env.PUBLIC_URL + "/images/insurgent-attack-2.gif"}
            ></img>
            Encircling Three Units
          </div>
        </div>
      </p>
    </div>
  );
};
