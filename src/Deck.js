import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const BASE_URL = "http://deckofcardsapi.com/api/deck";

// deck api for cards

function Deck() {
  const [deck, setDeck] = useState(null);
  const [draw, setDraw] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

// api for deck
  useEffect(() => { 
      async function getData() {
      let dk = await axios.get(`${BASE_URL}/new/shuffle/`);
      setDeck(dk.data);
    }
    getData();
  }, [setDeck]);

  // draw every card each sec.
  useEffect(() => {
    async function getCard() {
      let { deck_id } = deck;

      try {
        let drawResult = await axios.get(`${BASE_URL}/${deck_id}/draw/`);

        if (drawResult.data.remaining === 0) {
          setAutoDraw(false);
          throw new Error("No more cards remaining!");
        }

        const card = drawResult.data.cards[0];

        setDraw(dk => [...dk, {id: card.code,
                     name: card.suit + " " + card.value,
                     image: card.image }]);
      } catch (err) {
        alert(err);
      }
    }

    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDraw, setAutoDraw, deck]);

  const toggleAutoDraw = () => {
    setAutoDraw(auto => !auto);
  };

  const cards = draw.map(cd => (
    <Card key={cd.id} name={cd.name} image={cd.image} />
  ));

  return (
    <div className="Deck">
      {deck ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING CARDS!!
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default Deck;
