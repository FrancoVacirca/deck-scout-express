#### Change Log

- [x] store the filtered cards from query
- [x] use query to request to search API and store values that include the filteredCards
- [x] make so the stored cards are not getting repeated, just one time stored if the name doesn't exist
- [x] the response is only returning the cards that have stock, is this the behavior we want? maybe
- [x] create 3 endpoints to fetch card status, archidekt deck url, username, deck id from username response
- [x] from user-decks endpoint fetch decks and call deck-cards endpoint to fetch cards from each deck
- [x] for each card on deck, query card name to pirulo endpoint and return those who have stock and how much (how the fuck do i do this... send help)
- [x] organize files on a common structure for better maintainability and code readability (for this see last chat with copilot)
- [x] magic dealers
- [x] install and use nodemon

### TODOs

- [x] get url for each available card
- [ ] add categories (creature, instant...)
- [ ] add quantity (not all mtg players play commander only)
- [ ] serve card images
- [ ] create test cases

### API details

- variant-short-info variant-qty (span for stock in text)
- form (where all the data below is stored)
  - data-name (card name)
  - data-id (card id)
  - data-price (price)
  - data-category (card set)
  - data-variant (state of card)

_Archidekt API?_

### STRUCTURE

- /user-decks
  fetch for user decks and return decks data:
  ownerId: deck.owner.id,
  username: deck.owner.username,
  deckName: deck.name,
  deckId: deck.id,
  deckImage: deck.featured,

- /deck-data
  fetch for cards data of given id and return all card names and quantity

### LOGIC

There are two main ways to get a deck data

- 1: You paste the deck url and extract the program extracts the id
- 2: You save your archidekt user on deck scout and get all your decks provided by te program so when you click on one you search for the deck id extracted by the program

## CURRENT STATUS

- /search is getting the cards available with stock but cases where one card variety example Chatterfang, Squirrel General has 3 in stock being 2 in NM-Mint, Japanese and one Light Play, English then doesn't specify or create a new iteration of the same card with different data, also doesn't metion how much stock of the available card are
